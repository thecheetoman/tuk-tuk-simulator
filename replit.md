# Tuk Tuk Simulator 3D - Full Stack Application

## Overview

This is a full-stack 3D game application featuring a Tuk Tuk (auto-rickshaw) simulator set in an Indian urban environment. The application combines a React frontend with Three.js for 3D graphics, an Express backend, and PostgreSQL database integration using Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **3D Graphics**: Three.js with React Three Fiber (@react-three/fiber)
- **UI Components**: Radix UI primitives with Tailwind CSS
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: Zustand stores for game state, audio, fuel system, and vehicle management
- **Build Tool**: Vite with custom configuration for 3D assets
- **Asset Support**: GLTF/GLB models, textures, audio files, and GLSL shaders

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Configured for Neon Database (@neondatabase/serverless)
- **Development**: Hot reload with Vite middleware integration
- **API Structure**: RESTful API with `/api` prefix routing
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development

### Game Engine Components
- **Physics**: Custom physics system for vehicle movement and collision detection
- **Camera System**: Multiple camera modes (third-person, first-person) with smooth transitions
- **Audio System**: Web Audio API integration with background music and engine sounds
- **Particle Systems**: Exhaust smoke effects using Three.js particle systems
- **Procedural Generation**: Dynamic building and environment generation

## Key Components

### Game Systems
1. **Vehicle Physics**: Realistic tuk-tuk movement with acceleration, braking, and turning mechanics
2. **Collision Detection**: Comprehensive collision system for buildings, obstacles, and collectibles
3. **Fuel System**: Resource management with fuel consumption and refill mechanics
4. **Scoring System**: Points-based progression with pedestrian and collectible interactions
5. **Environmental Systems**: Day/night cycle, weather effects, and dynamic lighting

### 3D Environment
1. **Terrain Generation**: Large-scale procedural terrain with road networks
2. **Building Systems**: Indian-style architecture with slum buildings and urban structures
3. **Interactive Elements**: Collectible curry items, telephone poles, and environmental objects
4. **NPCs**: Pedestrian AI with pathfinding and interaction mechanics

### UI/UX Systems
1. **Game Menus**: Main menu, pause menu, and settings interface
2. **HUD Elements**: Speed meter, fuel gauge, and score display
3. **Loading System**: Progressive asset loading with visual feedback
4. **Audio Controls**: Volume management and mute functionality

## Data Flow

### Game State Management
- Zustand stores manage global game state across components
- State includes vehicle position, game phase, scoring, and system settings
- Real-time updates flow from physics calculations to UI components

### 3D Rendering Pipeline
- React Three Fiber manages the Three.js scene graph
- useFrame hooks provide per-frame updates for animations and physics
- Texture and model loading handled through drei utilities

### Audio Processing
- Web Audio API provides engine sounds and environmental audio
- Background music system with volume controls and muting
- Spatial audio effects for immersive 3D sound experience

## External Dependencies

### Core Dependencies
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers for React Three Fiber
- **@radix-ui/***: Accessible UI component primitives
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **three**: 3D graphics library
- **zustand**: State management library

### Development Tools
- **vite**: Fast build tool and dev server
- **typescript**: Type safety and development experience
- **tailwindcss**: Utility-first CSS framework
- **drizzle-kit**: Database migration and management tools

## Deployment Strategy

### Development Environment
- Vite dev server with hot module replacement
- Express server with middleware integration
- In-memory storage for rapid development iteration
- Asset serving with support for 3D models and textures

### Production Build
- Static asset optimization and bundling
- Database migration system with Drizzle
- Environment variable configuration for database connections
- Asset compression and caching strategies

### Database Schema
- User management system with authentication capabilities
- Extensible schema design for game progression and statistics
- PostgreSQL optimized queries and indexing

## Changelog
- June 28, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.