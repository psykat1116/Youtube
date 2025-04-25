## 📹 "Youtube" a Video Streaming and Shareing Platform System Made Using [NextJS](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), Typescript, [Drizzle](https://orm.drizzle.team/) As ORM, [NeonDB](https://neon.tech/) as PostgreSQL, [Clerk](https://clerk.com/) For Authentication, [tRPC](https://trpc.io/) For API Call, [Mux](https://www.mux.com/) For Video Processing, [Shadcn UI](https://ui.shadcn.com/) For User Interface And Much More.

## 🎯 Clone The Repo
```bash
git clone https://github.com/psykat1116/Youtube.git
```

## 🎯 Run The Development
### !! - Don't Forget To Convert The Folder Name To Lowercase Otherwise, It Can Lead To A Problem - !!
```bash
cd Youtube
npm run dev
```

## 🎯 .env File
### Create a .env file in the root folder with the following variable
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY =
CLERK_SECRET_KEY =
NEXT_PUBLIC_CLERK_SIGN_IN_URL = /sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL = /sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL = /
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL = /
WEBHOOK_SECRET =

UPSTASH_REDIS_REST_URL =
UPSTASH_REDIS_REST_TOKEN =

MUX_SECRET_KEY =
MUX_TOKEN =
MUX_WEBHOOK_SECRET =

DATABASE_URL =

UPLOADTHING_TOKEN =
```

## 🎯 Get Database Url
- Go Through [neonDB](https://www.neon.tech/) Website Create An Account & a project.
- After Create Your Free Project copy the connection string then paste it into the `DATABASE_URL` in the `.env` file
```bash
DATABASE_URL = postgresql://<username>:<password>@<host>:<port>/<database>?sslmode=verify-full
```

## 🎯 Ngrok Tunneling
This part is crucial for the webhook to work. As the webhook will not work on localhost, you need to create a tunnel using ngrok to expose your localhost to the internet.
- Go to [ngrok](https://ngrok.com/) and create an account.
- Go to the domain section and create a new permanent domain.
- Keep in mind that you can only create only one permanent domain in the free plan.
- Next step is to download the ngrok in your system. You can download it from the [Setup and Installation](https://dashboard.ngrok.com/get-started/setup/windows) using the command line or download the zip file and extract it.
- After downloading the ngrok, you need to set the authtoken. You can find the authtoken in the [Your Authtoken](https://dashboard.ngrok.com/get-started/your-authtoken).
- ```bash
  ngrok config add-authtoken <your-authtoken>
  ```
- After setting the authtoken, you need to create a tunnel. You can create a tunnel using the following command.
- ```bash
  ngrok http --domain <your-permanent-domain> 3000
  ```


## 🎯 Clerk Authentication
- Create Your Account And Create a New Application
- Set The Login And Sign Up for Medium Like Google, Github, Email, Phone No, etc
- Get `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` and paste into .env File
- Go Through the webhook section and create a new webhook and set the url to `https://<your-ngrok-permanent-domain>/api/webhook/clerk` and copy the secret key and paste it into the `.env` file
- Choose all the user events only (user.created, user.updated, user.deleted) the create a new webhook.
- Then choose the `signing secret` and copy it and paste it into the `.env` file as `WEBHOOK_SECRET`

## 🎯 Uploadthing Integration
- Go To Uploadthing Website Create An Account & Create a new project
- Get The API Keys In the `API keys section` And Set The Value Of `UPLOADTHING_TOKEN`.

## 🎯 Mux Integration
- Go To The MUX Website & Create An Account.
- Go To The Environment Section and Create a new environment.
- Go To `Settings -> Access Tokens -> Generate New Token`.
- Choose The Newly Created Environment, Select All The Permissions and Give a name to the token and click on `Generate Token`.
- Then Copy The `Secret Key` and paste it into the `.env` file as `MUX_SECRET_KEY`.
- Then Copy The `Access Token ID` and paste it into the `.env` file as `MUX_TOKEN`.
- Go To The `Settings -> Webhooks` then choose the newly created environment and click on `Create New Webhook`.
- There Also Choose The Environment and Give the below URL to notify the webhook.
- ```bash
  https://<your-ngrok-permanent-domain>/api/webhook/mux
  ```
- Then copy the `Signing Secret` and paste it into the `.env` file as `MUX_WEBHOOK_SECRET`.
  
## 🎯 Upstash Redis Integration
We are using Upstash Redis for Rate Limiting Purpose not the caching purpose.

- Go To The Upstash Website Create An Account & Create a new project in the `Redis` section.
- After Creating The Project Copy The `Redis Rest URL` and `Redis Rest Token` and paste it into the `.env` file as `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.