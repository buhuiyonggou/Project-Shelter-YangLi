import * as dotenv from 'dotenv'
dotenv.config()
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from  'express-oauth2-jwt-bearer'

const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: 'RS256'
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

// app.use(cors({
//   origin: ['https://project-shelter-yangli.onrender.com'], 
//   credentials: true, 
//   methods: ['GET', 'POST', 'PUT', 'DELETE']
// }));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

app.get("/", (req, res) => {
  res.send("Welcome to Project Shelter API");
})

app.get("/ping", (req, res) => {
    res.send("pong");
  });

// get all puppies from homepage, login not required
app.get("/puppies", async(req, res) =>{
  const puppies = await prisma.puppy.findMany();
  res.json(puppies);
});

// get a specific puppy's details, login not required
app.get("/details/:puppyId", async (req, res) => {
  const puppyId = parseInt(req.params.puppyId);
  try{  const puppy = await prisma.puppy.findUnique({
    where: {
      id: puppyId,
    },
    include: {
      adopter: true
    }
  });

  if (!puppy) {
    res.status(404).send("Puppy not found.");
  } else {
    res.json(puppy);
  }} catch (err) {
    res.status(500).send("Something went wrong.");
  }
});

// Get all adoption applications made by a client
app.get("/myapplications", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  try{
    const client = await prisma.client.findUnique({
      where: {
        auth0Id
      }
    });
    if (!client) {
      return res.status(403).send("Forbidden");
    }
    const applications = await prisma.application.findMany({
    where: {
      clientId: client.id,
    },
    include: {
      puppy: true, // include puppy details
    },
  });

  if (!applications) {
    res.status(404).send("No applications found.");
  } else {
    res.json(applications);
  }}  catch (err) {
    console.log(err)
    res.status(500).send("Something went wrong.");
  }
});

// Get all puppies marked as favorite by a client
app.get("/myfavorite", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  try {
    const client = await prisma.client.findUnique({
      where: {
        auth0Id
      }
    });

    if (!client) {
      return res.status(403).send("Forbidden");
    }
    const favorites = await prisma.favorite.findMany({
      where: {
        clientId: client.id,
      },
      include: {
        puppy: true,
      },
    });

    if (!favorites) {
      res.status(404).send("No favorite puppies found.");
    } else {
      res.json(favorites); // return only puppy details
    }
  } catch (err) {
    res.status(500).send("Something error");
  }
});


// Get all adoption applications made by a client
app.get("/myadoptions", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  try{
    const client = await prisma.client.findUnique({
    where: {
      auth0Id,
    },
    include: {
      adoptedPuppies: true,
    },
  });

  if (!client) {
    res.status(404).send("Client not found.");
  } else {
    res.json(client.adoptedPuppies);
  }} catch (err) {
    res.status(500).send("Something went wrong.");
  }  
});

// Cancel application
app.delete("/myapplications/:puppy_id", requireAuth, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const {puppy_id} = req.params;
    if (!puppy_id) {
      return res.status(400).send("Please specify a puppy");
    }
    const client = await prisma.client.findUnique({
      where: {
        auth0Id,
      },
    });

    if (!client) {
      return res.status(404).send("Client not found");
    }
    const application = await prisma.application.findFirst({
      where: {
        clientId: Number(client.id),
        puppyId: Number(puppy_id)
      }
    });
    if (!application) {
      return res.status(404).send("Application not found");
    }
    await prisma.application.delete({
      where: {
        id: application.id
      }
    });
   await prisma.puppy.update({
      where: {
        id: Number(puppy_id)
      },
      data: {
        adopted: false
      }
    })
    res.status(200).send();
  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
})

// Submit a new adoption application
app.post("/myapplications", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { puppyId, name, address, phone, occupation, reasonForAdopt } = req.body;

  if (!puppyId) {
    return res.status(400).send("Please specify a puppy");
  }

  try {
    const puppy = await prisma.puppy.findUnique({
      where: {
        id: Number(puppyId)
      }
    })

    const client = await prisma.client.findUnique({
      where: {
        auth0Id,
      },
      include: {
        adoptedPuppies: true,
      },
    });

    if (!client) {
      return res.status(404).send("Client not found");
    }

    const newApplication = await prisma.application.create({
      data: {
        client: {
          connect: {
            id: client.id,
          },
        },
        puppy: {
          connect: {
            id: Number(puppyId),
          },
        },
        status: "pending",
      },
    });

    await prisma.puppy.update(
      {
        where: {
          id: Number(puppyId)
        },
        data: {
          adopted: true,
          clientId: client.id
        }
      }
      );

    // Update puppy and client's details
    await prisma.client.update({
      where: {
        id: client.id,
      },
      data: {
        name,
        address,
        phone,
        occupation,
        reasonForAdopt
      }
    });

    res.status(201).json(newApplication);
  } catch (err) {
    console.log(err)
    res.status(500).send("Something went wrong.");
  }
});

// Cancel an adoption application
app.put("/myapplication/:applicationId", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const applicationId = parseInt(req.params.applicationId);

  const client = await prisma.client.findUnique({
    where: {
      auth0Id,
    },
  });

  const application = await prisma.application.findUnique({
    where: {
      id: applicationId,
      clientId: client.id,
    },
  });

  if (!application) {
    return res.status(404).send("Application not found");
  }

  const updatedApplication = await prisma.application.update({
    where: {
      id: applicationId,
    },
    data: {
      status: 'cancelled'
    }
  });

  res.status(200).json(updatedApplication);
});

// Get puppy if in favorites
app.get("/myfavorite/:puppy_id", requireAuth, async (req, res) => {
  try {
    const {puppy_id} = req.params;
    const auth0Id = req.auth.payload.sub;

    const client = await prisma.client.findUnique({
      where: {
        auth0Id,
      },
    });

    if (!client) {
      return res.status(404).send("Client not found");
    }

    const favorite = await prisma.favorite.findFirst({
      where: {
        clientId: client.id,
        puppyId: Number(puppy_id)
      }
    });
    res.status(200).send(favorite);
  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
});

// Cancel favorites
app.delete("/myfavorite/:puppy_id", requireAuth, async (req, res) => {
  try {
    const {puppy_id} = req.params;
    const auth0Id = req.auth.payload.sub;

    const client = await prisma.client.findUnique({
      where: {
        auth0Id,
      },
    });

    if (!client) {
      return res.status(404).send("Client not found");
    }

    const favorite = await prisma.favorite.findFirst({
      where: {
        clientId: client.id,
        puppyId: Number(puppy_id)
      }
    });

    if (!favorite) {
      return res.status(404).send("Not found");
    }

    await prisma.favorite.deleteMany({
      where: {
        clientId: client.id,
        puppyId: Number(puppy_id)
      }
    })

    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// Add a puppy to favorites
app.post("/myfavorite", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { puppyId } = req.body;

  if (!puppyId) {
    return res.status(400).send("Please specify a puppy");
  }

  try {
    const client = await prisma.client.findUnique({
    where: {
      auth0Id,
    },
  });

  if (!client) {
    return res.status(404).send("Client not found");
  }

  const newFavorite = await prisma.favorite.create({
    data: {
      clientId: client.id,
      puppyId: Number(puppyId)
    },
  });

  res.status(201).json(newFavorite);
  } catch (error) {
    res.status(500).send("Something went wrong.");
  }
});

// get puppy application status
app.get("/puppies/:puppy_id/is-applied", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const {puppy_id} = req.params;
  const client = await prisma.client.findUnique({
    where: {
      auth0Id
    }
  });

  const application = await prisma.application.findFirst({
    where: {
      clientId: client.id,
      puppyId: Number(puppy_id)
    }
  })
  res.status(200).json(application);
});

// get Profile information of authenticated user(client)
app.get("/me", requireAuth, async(req, res) =>{
  const auth0Id = req.auth.payload.sub;
  console.log(auth0Id)
  const client = await prisma.client.findUnique({
    where: {
      auth0Id,
    },
  });
  if (client) {
    res.json(client);
  } else {
    res.status(404).send('Client not found');
  }
});

// update profile
app.put('/me', requireAuth, async (req, res) => {
  try {
    const {name, phone, address, occupation, reasonForAdopt} = req.body;
    const auth0Id = req.auth.payload.sub;

    const client = await prisma.client.findUnique({
      where: {
        auth0Id
      }
    });

    if (!client) {
      return res.status(404).send("Not found");
    }

    await prisma.client.update({
      where: {
        id: client.id
      },
      data: {
        name,
        phone,
        address,
        occupation,
        reasonForAdopt
      }
    });
    res.status(200).send();

  } catch (err) {
    res.status(500).send(err);
  }
})

// verify user status, if not registered in our database we will create it
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];
  const address = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/address`];
  const phone = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/phone`];
  const occupation = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/occupation`];
  const reasonForAdopt = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/reasonForAdopt`];

  let client = await prisma.client.findUnique({
    where: {
      auth0Id,
    },
  });

  if (!client) {
    client = await prisma.client.create({
      data: {
        auth0Id,
        name,
        phone,
        email,
        address,
        occupation,
        reasonForAdopt,
      },
    });
  }

  res.json(client);
});

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
 console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
});

 