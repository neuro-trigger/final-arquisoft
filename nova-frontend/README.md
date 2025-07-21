# Nova - Digital Wallet

Nova is a digital wallet application built with Next.js, offering secure money transfers, smart savings, and complete financial control in one place.

## 🚀 Features

- **Instant Transfers**: Send and receive money instantly with zero fees
- **Bank-Level Security**: Industry-leading security measures
- **Spending Insights**: Detailed reports and analytics

- **Responsive Design**: Beautiful UI that works on all devices

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Font Awesome](https://fontawesome.com/)
- **Font**: [Poppins](https://fonts.google.com/specimen/Poppins)
- **Language**: TypeScript
- **Package Manager**: npm/yarn/pnpm

## 📦 Project Structure

```
nova-frontend
├── .next
├── node_modules
├── public
├── src
│   ├── app
│   │   ├── (auth)
│   │   │   ├── login
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   └── register
│   │   │       ├── loading.tsx
│   │   │       └── page.tsx
│   │   ├── dashboard
│   │   │   ├── layout.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── Footer.tsx
│   │   └── Header.tsx
│   ├── lib
│   ├── styles
│   └── types
├── .dockerignore
├── .gitignore
├── Dockerfile
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.js
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json

```

## 🚀 Development Setup

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- Access to the project repository

### Installation

1. Clone the repository:
```bash
git clone https://github.com/software-architecture-proj/nova-frontend.git
cd nova-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
NEXT_PUBLIC_API_URL_EXAMPLE=your_api_url_here_example
```

### Development Workflow

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Running Production Build

```bash
npm run start
# or
yarn start
# or
pnpm start
```

## 🎨 Styling Guidelines

The project uses Tailwind CSS for styling with custom configurations:

- Custom gradient backgrounds
- Responsive design
- Dark mode support
- Custom animations and transitions
- Component-specific styles

Key style classes:
- `.gradient-bg`: Gradient background
- `.card-hover`: Card hover effects
- `.feature-icon`: Feature icon styling
- `.transaction-item`: Transaction list items
- `.savings-progress`: Progress bars



## 🔒 Security Standards

- Bank-level encryption
- Secure authentication
- Regular security audits
- GDPR compliant
- Data protection measures

## 📝 Development Guidelines

1. Follow the established coding standards and conventions
2. Write meaningful commit messages
3. Create feature branches from the main development branch
4. Ensure all tests pass before submitting changes
5. Update documentation when making significant changes

## 🔄 Deployment Process

1. All changes must be reviewed and approved
2. Automated tests must pass
3. Code quality checks must be satisfied
4. Deployment to staging environment for testing
5. Production deployment after successful staging tests

## 📚 Additional Resources

- Internal documentation
- API documentation
- Design system guidelines
- Security protocols

## 🐳 Docker Setup

### Building the Docker Image

To build the Docker image, run:

```bash
docker build -t nova-frontend .
```

### Running the Docker Container

To run the container:

```bash
docker run --name noda-frontend-containter -p 3000:3000 nova-frontend
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Docker Compose (Optional)

If you're using Docker Compose, you can use the following command:

```bash
docker-compose up
```
