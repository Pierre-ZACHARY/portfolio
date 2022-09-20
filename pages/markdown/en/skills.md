

# Performance
## ![cIcon](/icons/C_Logo.png "C") ![cppIcon](/icons/c++.png "C++") C / C++
### ![openMpIcon](/icons/OpenMP_logo.png "OpenMP") ![mpiIcon](/icons/Open_MPI_logo.png "MPI") OpenMp / MPI
Optimising programs on multicore CPU with **OpenMP** and multi-CPU with **MPI**
### ![cudaIcon](/icons/cudaIcon.png "Cuda") Cuda
Exporting scripts running on CPU to GPU with **Cuda** sdk from Nvidia. I also made a program to apply filters on images

## ![pythonIcon](/icons/python.png "Python") Python ?!
### Graph Theory
I made a hand-made algorithm to solve min-cut Graph problem, with multi-threading and JIT compilation
### Web-Scrapper
I had to make a Web-Scrapper ( see Data section ), so I optimised it with asynchronous requests, JIT compilation and multi-threading to parse the html responses

## ![rustIcon](/icons/Rust.png "Rust") Rust
### ![wasmIcon](/icons/WebAssembly_Logo.png "Wasm") WebAssembly
I made a litte 2D game for the web running 100% with **WebAssembly** and Rust SDK

# Native Development 

## ![csharpIcon](/icons/csharp.png "C#") C#
### ![unityIcon](/icons/unity.png "Unity") Unity
- For a University project, I made a little mini-game where I tried to use as much Unity features as possible, including Multiplayer with **Netcode**, Shader/VFX Graph, Async Scenes load, **procedural** terrain...
- Following tutorials, I tried to make a game resembling **Minecraft** with Perlin-Noise Terrain generation ( biomes, surface, structures, caverns, ores ), putting textures and shadows on Voxel, a simple inventory system and a way to destroy and place blocks.
- Using **Compute Shader** ( See performance section with Cuda, it's nearly the same sdk ), I made a script capable of spawning **3D grass** on any surface at runtime ( like BOTW ), and without the use of Geometry shaders ( because these kind of shaders doesn't work on any platform ). 

### ![xamarinIcon](/icons/logo-xamarin.png "Xamarin") Xamarin Forms 
I made a **mobile app** for project management with mail authentication, handling timestamp and showing graphics depending on User's working time.

## ![dartIcon](/icons/Dart-logo.png "Dart") Dart
### ![flutterIcon](/icons/flutter.png "Flutter") ![firebaseIcon](/icons/firebase.png "Firebase") Flutter
For a University project I made a cross-platform app, inspired by WhatsApp or similar. I used Firebase since it's SDK for Flutter is really great, and added basics functionnality for a chat app : sending and editing and removing textual messages as well as messages with media and stickers, a way to create groups, adding and removing peoples or groups, a way to search for Users, a way to editing your User profile. You also get in-app and push notifications.

## ![javaIcon](/icons/java.png "Java") Java / Kotlin
### ![androidIcon](/icons/Android.png "Android") Android 
I made a products comparator using the native Android SDK and a hand-made API made in Flask

### JavaFX
For an educational group-project, we made a desktop auction sales in JavaFX + MySql ( no authentication knowledge at this point )

## ![jsIcon](/icons/js.png "Javascript") Javascript
### ![reactIcon](/icons/React.png "React") ![tsIcon](/icons/Typescript.png "Typescript") React Native
( In progress ) I want to export my Android comparator to React Native, the objective is to share all my view between Mobile, Desktop and Web. I don't want to use React because the web sdk is too large and I also want a DOM. I don't want a WebView app with something like Ioniq because the UX for mobile isn't great, and Blazor, for the same reason as Flutter & Ioniq.

# Web Development

## ![javaIcon](/icons/java.png "Java") Java 
### JavaEE
I hade to made web-servers using **Struts** and **JavaEE**

### ![springIcon](/icons/spring.png "Spring") Spring
I made webservices using **Spring**, handling JWT authentication, roles, and communication with others microservices

## ![pythonIcon](/icons/python.png "Python") Python
### ![flaskIcon](/icons/flask.png "Flask") Flask
- I created basic web-server ( like express.js ) in python-Flask, for educational purposes
- I also made REST web-services in Flask in order to communicate with microservices ( like a scrapper written with Playwright, Selenium or Srappy ). Also, it's implementing JWT authentication.

## ![phpIcon](/icons/PHP.png "PHP") Php
### ![wpIcon](/icons/wordpress.png "Wordpress") WordPress
**Approved internship of 4 Months** at [EKELA](https://www.ekela.fr) web agency. This Internship gave me the opportunity to professionalize myself, to acquire advanced skills in web-development via WordPress, UI/UX design and SEO skills.

### ![symfonyIcon](/icons/symfony.png "Symfony") Symfony
- For a University project I made a FullStack app using **Symfony**
- I also used Symfony as a back-end API with **Api-Platform**, using **Angular** as a Front-End framework 

## ![jsIcon](/icons/js.png "Javascript") Javascript
### ![angularIcon](/icons/angular.png "Angular") Angular
I made a Front-End management webapp with basic features such as JWT authentication
### ![reactIcon](/icons/React.png "React") ![tsIcon](/icons/Typescript.png "Typescript") React + Next
The website on which you are reading this is made of React and Next, I made a Blog Posts to give more information about that.
### ![astroIcon](/icons/astro.png "Astro") ![vueIcon](/icons/vue.png "Vue") ![svelteIcon](/icons/svelte.png "Svelte") Vue + Svelte + Astro
( In progress ) I want to create a website prototype using Astro and some Front-Framework like Vue or Svelte, and some microservices to handle authentication, sending mails, realtime search... The goal is to be able to use the prototype in multiple use-cases

# Data
## Sql
### ![sqliteIcon](/icons/sqllite.png "SqlLite") ![mysqlIcon](/icons/mysql.png "MySql") ![postgresIcon](/icons/postgres.png "Postgres") MySql, Sqlite, Postgres
- I have multiples experiences of exploiting sql-databases within multiples project

## ![pythonIcon](/icons/python.png "Python") Python
### Web-Scrapper
I made a scrapper to fetch huge amount of data about products pages ( see Android / Python web and performance section ). It is capable of handling multiple requests type : basic html, api requests, javascript webapp, mobile app...

### Bases de l'IA 
- In a university context, I learned different algorithms, such as local search, paths and backtrack 
- ( In progress ) I'm trying to make an algorithm to classify pages that sell the same product using a neural network and User's feedbacks

## ![rIcon](/icons/R.png "R") R
### Classifieur de page Web
I had to create a Html classifier to find similar blog pages using R and SVM
