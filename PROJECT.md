# Project Plan

<!--
  This file is your team's shared brain.
  Fill it in together during brainstorming. Save it.

  - Claude Code reads this automatically. It will know what you're building.
  - Your marketing/pitch team uses this to build the pitch deck.
  - One file, everyone's on the same page.
-->

## Product

**Name:** ActiveTogether

**One sentence:** A platform to find and join local group sports and outdoor activities.

**Problem:** People struggle to find enough players and coordinate time, place, and cost to organize group sports or outdoor activities like hikes.

## Target Audience

**Who is this for?** athletes, group sport amatures, solo players , casuals, game organisers

**Why would they use it?** to find an orgainzed group game in team sports (football, basketball , hand ball , ......)

## Pages & User Flow

<!-- List every page. Describe what the user sees and does on each. -->

1. `/login` and `/signup` — email + password authentication
2. `/` — a search bar , cards for events , each event pops up with event details and a participation form and submit button
3. `/new` a form page to create an event (a group sport game or a hike), form contains [ name , location link , location name , type , gender ( males|females|mixed ),description , price (or free) ]

**User flow 1:**

1. User signs up or logs in
2. looks for the appropriate event
3. consults the event details
4. submits his information for participation

**User flow :**

1. User signs up or logs in
2. consults the creation page
3. fills info and submits the organized event for public

## Data Model

<!-- What are you storing? Keep it to 1-2 tables for an MVP. -->

**Table: [User]**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| fullname | String | notnull |
| birthdate|string | |
| email|string | |
| phone|int | |
| user_id | uuid | Owner of this row |
| created_at | timestamp | Auto-set |

**Table: [Event]**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| Name | String | Not Null |
| Type | enum | Not Null |
| Location link (latitude) | String | Not Null |
| Description link (latitude) |String | Not Null |
| Location link (longitude) | String | Not Null |
| Description Link (longitude) | String | Not Null |
| Gender | Enum | Not Null |
| Price | Int | Not Null |

**Table: [Sport]**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| Name | String | Not Null |
| Type | enum | Not Null |
| max_players | Int | Not Null |

## Scope Check

<!-- Can you build this in 2 hours? Answer honestly. -->

- [ ] We have 3 pages or fewer
- [ ] We have 1-2 database tables
- [ ] We can explain the core feature in one sentence
- [ ] We've cut everything that isn't essential for the demo

## Pitch Outline

<!-- Your marketing team uses this section to build the pitch deck. -->

**The problem:** [1-2 sentences — what sucks about the status quo?]

It is hard to find people who share the same sport interests as you in the right numbers to actually organize a match, training session, or tournament. Algeria also lacks recreational sports opportunities, with unused facilities, limited sport diversity beyond football, and many coaches and players whose interests remain untapped.

**Our solution:** [1-2 sentences — what does your product do about it?]
It connects people who share the same sport interests whether solo players or groups so they can easily find each other and organize matches, training sessions, or tournaments. It also helps coaches find opportunities, encourages discovery of new sports and contributes to building a stronger sports culture in Algeria.

**Key differentiator:** [what makes this different from existing solutions?]

Existing solutions are fragmented, with people relying on general social media, personal contacts, or physically going to sports venues and waiting to find others to play with. This makes the process inefficient and often awkward, since asking strangers directly to join a game is not always comfortable or reliable. Our solution removes this friction by making it easy to find players and organize structured matches and coaching sessions in one place.

**Demo moment:** [what's the one thing you'll show that makes people go "oh, that's cool"?]

**Target market:** [how big is this? who are the first users?]

Sport is a major interest in Algeria, with studies showing around 64% of the population interested in sports, even higher than some European countries, which indicates a large potential user base.

Our first users are amateur and casual players looking to find people to play with, followed by sports facility owners, coaches, and small local sports communities who need a structured way to organize matches, training sessions, and tournaments.

**The ask:** [what do you need? users, funding, feedback?]

We need sports facility owners to collaborate with us, as well as coaches, sponsors, and event organizers to help run matches, training sessions, and tournaments. We also need early users (players) to join the platform and help us test and grow the community.
