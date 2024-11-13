# Cookbook - Recipe Sharing Platform

A modern web application for sharing and discovering recipes, built with React, Next.js, and Firebase.

## 🚀 Features

- **User Authentication**
  - Email/password login
  - Google sign-in integration
  - User profile management

- **Recipe Management**
  - Create and share recipes
  - Upload recipe images
  - Add detailed ingredients and instructions
  - Browse community recipes

- **Subscription System**
  - Free tier with basic features
  - Premium tier with advanced features
  - Secure payment processing

- **Modern UI/UX**
  - Responsive design
  - Dark/light mode support
  - Intuitive navigation
  - Real-time updates

## 🛠️ Tech Stack

- **Frontend**
  - React 18
  - Next.js 14
  - Tailwind CSS
  - shadcn/ui components
  - TypeScript

- **Backend/Services**
  - Firebase Authentication
  - Firebase Firestore
  - Firebase Storage
  - Firebase Hosting

## 📦 Installation

1. **Clone the repository**
   ```
   git clone https://github.com/yourusername/cookbook.git
   cd cookbook
```
2. **Install dependencies**

```
npm install
```

3. **Set up environment variables Create a .env.local file in the root directory:**

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id


4. **Start the development server**

```
npm run dev
```

5. **Open your browser Navigate to http://localhost:3000**


## 📁 Project Structure

cookbook/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── recipes/
│   ├── components/
│   │   ├── ui/
│   │   └── recipes/
│   ├── lib/
│   │   └── firebase.ts
│   └── styles/
│       └── globals.css
├── public/
├── firebase/
│   ├── storage.rules
│   └── firestore.rules
└── package.json


## 🔧 Configuration

# Firebase Setup

2.Create a new Firebase project
3.Enable Authentication services
4.Set up Firestore database
5.Configure Storage rules
6.Update security rules for production

# Development
```
# Run development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test
```


## 🚀 Deployment

1. **Build the application**
```
npm run build
```

2. **Deploy to Firebase**
```
npm run deploy
```

## 🤝 Contributing

Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request


## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.


## 👥 Authors

Arshdeep Singh - arsh342


## 🙏 Acknowledgments

React Documentation
Next.js Documentation
Firebase Documentation
shadcn/ui Components
Tailwind CSS


## 📧 Contact

Email: arshth134@gmail.com
Project Link: https://cookbookv2-y8ir.vercel.app/


## 🔮 Future Features

Recipe rating and review system
Social sharing integration
Advanced search and filtering
Recipe collections and favorites
Meal planning calendar
Shopping list generation


This comprehensive README.md file provides a complete overview of your Cookbook project, including installation instructions, features, tech stack, project structure, and contribution guidelines. It follows modern README best practices with clear sections, emojis for better readability, and detailed instructions for setup and deployment.

