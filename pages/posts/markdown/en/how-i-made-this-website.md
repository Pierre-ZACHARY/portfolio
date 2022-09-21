---
title: 'How I made my website'
date: '2022-09-21'
description: 'In this post I try to explain the different tech stack, such as **Next** and **React** I chose and the decision I took to build my personal website.'
---

So you want to know how I made this website ? You are in the right place, in this post I'll explain every part of it tech stack, and why I took this particular decision to build my portfolio.

# The framework

In first, I had to choose the framework, all I have known for front development was Angular, but everytime I start a new personal project I like to try something different.

## Next & React

So, I have to say that, even now, **React** is still the most popular client-side framework, and since I had never touched it, I wanted to give it a try.
But React alone isn't great for **Performance & SEO**, because it needs to load all the javascript before rendering any HTML to the client, which may take some time, and robots may not find in-page headings and that would be bad for SEO.
What you can do to solve this is to use another framework to render html on the server and then give it to the client without any need of loading javascript. A popular framework for that is **Next.js**. 

Now you may ask, what are my feedback on these two ?

Well, at first I have to say that they are very intuitive to use :
- React as a good **Components based architecture** which make your view really re-usable. Also, even if it's hooks seems hard to understand, you can start using **useState or useContext** really easily.
- Next take all the routing of your application based on your server file-system, even for dynamic path, very easy to use. Also, if you have dynamic content on your pages, Next allow you to choose your refreshing method, with SSG, SSR, ISR or CSR : 
  - **Server Side Generation**, your page content is only loaded at build time
  - **Server Side Rendering**, it reloads your page whenever a request comes in, or once a request comes in after x seconds
  - **Incremental Server side rendering**, for dynamic content where you may have thousands of pages, you may not want to generate them at build time. For that, next allow you to generate your content when the first request comes in for this specific pages. And it's just one line of codes
  - **Client Side Rendering**, the classic React behaviour, great when you need specific info from the user navigator, like window size, system theme...
- Also, Next as some built-in components, like Image, Script, Links, to optimise your pages load, your images sizes, and to make your application feel like a SPA, even if it isn't.

But there are some cons, for Next you can't just import images from any CDN with the Image optimised component, also if you use **Storybook** to test your React Components, you'll have to do some manual installation to make it work with Next components. 
On the React side, even if I said that the component architecture is really intuitive and hooks are easy to use, the way it's designed may lead to performance issues, like with a bad **setState inside a useEffect**. 
Did you already try to send a notification to your server whenever your client finished loading the pages ? To increment a view counter or something... Well since React 18, use-effect is called 2 times, so if you want your counter to be called one time you have to make a dedicated hook.
Sometimes I just want to change a specific variable in my pages, but since this variable is at the top of the page hierarchy, it'll **re-render all the page components**, not great for performances. 
Also, whenever you want to share state between your components, even with useContext, it seems hard to do for no reason.

## Redux
And, that's where Redux comes in.
Redux is a tool that wrap your application in a **single context**, providing your components only the necessary state and refreshing them only when needed.
It's really great to helps you share the state of your components.

It comes with some cool **dev-tools** which helps you go back and forward your application usage, and that also helps you share the application state of a User that got a bug.

But that's not so convenient, you'll have a lot of boilerplate code to write yourself.
I know there are **Redux alternatives** with less boilerplate code, but since Redux is so popular I had to test it to get my own opinion on it.

## i18n & Next-Themes

Next comes with some notable plugin ( which really are plug-in ), such as Next-i18n, a **server side version of the same plugin for React**, very good for SEO when you have translated pages.
And **Next-Theme**, which good with hooks to make it easy to change your app theme, use the user-system one, and apply class on your body depending on the selected-themes, easy to use.

# Databases, Tools & Other microservices

Since I'm not a designer nor an excellent Front-End developer capable of making my own pages designs, by making this website I wanted to show that I'm capable of implementing **multiples features** and using some tools / microservices.

## Framer Motion

At first I was making my animation using the default React Animation library, and then I discovered **Framer Motion** and it's awesome **Layout** animation features, which automatically animate any change of your component css.

Moreover, the animation using Framer are so smooth that I wanted to remade mine with it.

The only cons I find is that when animating something inside a fixed component, it may give wrong animation when loading a new page ( which reset the scroll position ).

## Firebase

The most common features to be implemented on a website is authentication. Well I have to say that using Firebase, there isn't much left to do from the developer... 

Firebase allowed me to **easily set-up user authentication**, sending user-related mails, like password reset, and storing user-related information with its **real time database**.

I've also used it to make a **real-time comment section**, handling medias, upvotes and replies.

I haven't much to say beside its **great developer experience**. I know that Firebase may become very costly when your application grow in scale, but that's a personal website, so I don't really have to worry about that.

## Spline

Since 3D websites is very popular and wanted to add some 3D to mine. I had some basic knowledge on 3D, with an experience on OpenGL ES, making my own game without a game-engine on an Android Device. I also already used blender for some modeling, but I haven't that much experience with it.

So, I needed something easy, and Spline, is really easy. Their **webapp** allow you to model your 3D objects, add materials, and to add events to move them from user-input, or from your javascript code. There even is a **React SDK** for easy integration on your website.

You are quite limited, in terms of features, compare to blender, but that's enough for web 3D. You can also **benchmark your scene** when finished to understand where you need optimisation.

## Hand-made Chatbot

A chatbot is a very common feature on web, it allows costumer to ask questions without the need to send a mail or contact the support by any other way.

I already had to create chatbots, in my other web experiences, but I often had to use a specific sdk with dedicated application, and I have none of these for my website. 

Another option I have, is to use an existing application, like **Discord** or Slack, and to share messages between my website and the app. Discord bots support two languages : **Javascript ( node ) and Python**. 
Ideally, I would like to put the server-side code for my discord bot on my website, so I don't have to run another server instance. But there is one problem : I use Vercel for hosting my Next app, and Vercel doesn't allow your app to run 24/24 ( only boot up when needed ), and my chatbot, potentially need to maintain its **websocket** connection for longer than the maximum function runtime allowed by Vercel. In others words, **I can't host my discord bot on Vercel**.  

So I have chosen to host it on **Heroku**. I made a little **Python** script to listen for messages from both sides ( web & discord ), and send it to the other side. Then I made a widget on my website that connect to my bot websocket endpoint, and interact with it.
Sadly, one month after I have done that, I heard that free-plan will be removed from Heroku. I plan to change it to **Railway**, which offer 5$ monthly, by then.

## Medusa

Another really common feature for web is **e-commerce**. I already have experience with **shopify**, and so I wanted to try something **open-source**, also I wanted to integrate the storefront to my website ( I could have used the default storefront of medusa ).

[Medusa]("https://medusajs.com/") is an open-source e-commerce platform composed of **3 services** : the core, the admin/back and the storefront ( optional ). Its core is a REST Api that handle every transaction for admin and client front, from getting items info to completing the order.

It also has a javascript client to helps you integrate its front to any node based websites.

The only cons I found is that **it may lack of features** when it comes to customising your items, like, you can't complete an order without choosing a shipping address ( isn't great digital product for example ), you can't also choose what thumbnail to display for a specific item variant. And it would also be cool to have a way to directly propose subscription ( order an item every x day or something like that ... )

For information, I used **Stripe** and **Paypal** for processing payments.

## Storybook

Last tools I want to talk about is **Storybook**. I already mentioned it before, saying that it isn't easy to integrate with Next, since Storybook can't do SSR.

But there are cool features, like **component isolation testing or visual regression**. And for people that use **Figma** or Any UI/UX software to design their view, it's easy to integrate your design components to Storybook and begin working on them within it.

# What I would do if I had to remake this website
The first problem I have with my website is the huge amount of refresh on every component, because of React's rendering architecture. It makes some part of the app, load and reload more than needed and make the navigation feel slower. 

Another point that I don't like is that there is no way to chose **when to load a specific component**. 
You can do that when loading a script, with the Next/Script component, and it's built-in for Images, but the only thing you can do with components is to lazy load them using **React Suspense** ( that will execute the component Javascript **ASAP**, but will show the page before the execution is finished ).
In my case I would like a way to say "don't load this until the page is fully interactive", but I can't figure a way to do that.

The most recent frameworks handle this by adopting the **"Island Architecture"**, this make you able to send the javascript to the client **only when needed**. 
Two interesting examples for that are [Astro]("https://astro.build/") and [Fresh]("https://fresh.deno.dev/"). Better than that, Astro makes you able to **use any Front framework**, like React, Angular or View... So if you don't like one, or if you need a specific library that doesn't exist on your framework, you can still change without remaking all your app.

The second thing I want to mention is that I would be a better experience for me to adopt the microservices' architecture at the beginning of my work. And by that I mean to deploy my app, not by using multiples host like Vercel, Heroku or Railway, but using Docker or Kubernetes to deploy **all my microservices at the same place** ( and on the same server, which can improve communications speed between them ).
For that purposes I would like to try more Open-Source Solutions that I can self-host. As an alternative to Firebase I could have used [Supabase]("https://supabase.com/"), [Appwrite]("https://appwrite.io/"), or maybe [SurrealDb]("https://surrealdb.com/").
Also, if I had to remake the website from the beginning, I would start by setting up [Meilisearch]("https://www.meilisearch.com/"), so that I would be able to index all my pages to have a single entrypoint for real-time search, and a single DHCP Server.

Another kind of microservices that I didn't use are errors tracking or analytics. Two great open-sources tools to do that are [GlitchTip]("https://glitchtip.com/") and [Plausible]("https://github.com/plausible/analytics").

Finally, I'm currently using markdown as a CMS inside my git repo, that give me a good developer experience, but it may not be very scalable for a webapp to share with non-developer people. A better way to do Content Management would be to use a dedicated tool, like [Strapi]("https://strapi.io/") or [Tina]("https://tina.io/").

# Codepen & others sources of inspiration

I would add that I got inspired by some codepen, are others works :
- [The javascript confetti screen]("https://codepen.io/Gthibaud/pen/ENzXbp") from Gthibaud, which I used on the order screen when you just completed an order.
- [FontAwesome]("https://fontawesome.com/"), all my icons comes from their free tier
- [The magic card effect]("https://codepen.io/gayane-gasparyan/pen/jOmaBQK") from Gayane, which I used for my blog posts cards
- [The chat notification widget]("https://codepen.io/coswise/pen/NWqNWqe") from Cosimo Scarpa, I didn't really used his code but remade something similar using React and Framer
- [The drag confirm button]("https://codepen.io/coswise/pen/LYNaJrO") also from Cosimo Scarpa, that I used for my logout confirmation on the user profile page
- [A little credit card animated button]("https://codepen.io/TurkAysenur/pen/wvaGqXW") from Aysenur Turk. I used it on my card widget when you click on confirm payment.
- [The blog of Maxime Heckel]("https://blog.maximeheckel.com/"), for information about Framer Motion ( as well as officials docs ).
- I also got alot of inspiration by the work of [Aaron Iker]("https://codepen.io/aaroniker")


