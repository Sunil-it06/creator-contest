FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Prisma 7 config requires DATABASE_URL during generate
ENV DATABASE_URL="postgresql://postgres:postgres@postgres:5432/creator_contest_admin?schema=public"

RUN npx prisma generate

EXPOSE 6001

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]