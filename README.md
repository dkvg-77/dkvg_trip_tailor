# Trip Tailor   
- a Personalised Travel Itinerary Generator   

## Important Links
-> **Website Link** -> https://dkvg-trip-tailor.vercel.app/       

-> **Repository Link**-> https://github.com/dkvg-77/dkvg_trip_tailor       

->  **Presentation Link** ->  https://docs.google.com/presentation/d/1BuXqDrg_wExxuQjG8FhLPC1vxOZl9qnTIQhon7NgDc8/edit?usp=drive_link    

-> **Video Link** -> https://drive.google.com/file/d/1hUfFxE0Dt_rrQmOsOso9GFXFG59XB7Z4/view?usp=drive_link       

-> **Resume Link** -> https://drive.google.com/file/d/1SJgcIGtXwE-Z62BYiSDs2vOVlVpt1JFK/view?usp=sharing  


## Important Featurers   
-> Created a web application that generates personalized travel itineraries to a desired destination/city.   
-> The places are generated based on user preferences, such as budget, interests, and trip duration.     
-> Select the locations you like. Finally an optimized tour plan will be displayed.   
-> Register and login to save your Tour plans.   

  
## Tech stack used
-> **NextJS**, which is a framework of React.     
-> **NodeJS** in the backend.   
-> Various **Google APIS** for the generation of suitable tour plan.    
-> **MongoDB** for the storage of user info and plans info.   
-> **Vercel** for deployments.   

## Getting Started   
First clone the repository.   
```bash   
npm install   
npm run dev   
```   
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.   

## Project Structure   
<pre>
my-app2/   
├── src/
│   ├── app/                             # Main application folder containing pages and utilities   
│   │   ├── plan/                        # Handles travel plan creation and details   
│   │   │   ├── [uniqueId]/              # Dynamic route for accessing specific plans by unique ID   
│   │   │   │   └── page.js              # Displays details of a specific travel plan   
│   │   │   └── page.js                   
│   │   ├── preferences/                 # Page to set user preferences for personalized itineraries   
│   │   │   └── page.js                   
│   │   ├── recommendations/             # Displays personalized recommendations based on user preferences   
│   │   │   └── page.js                    
│   │   ├── register/                    # User registration pages   
│   │   │   └── page.js                 
│   │   ├── saved-plans/                 # view saved travel plans   
│   │   │   └── page.js                  
│   │   ├── utils/                       # Utility functions and files for backend operations   
│   │   │   └── db.js                  
│   │   ├── layout.js                    # Layout component ensuring consistent layout for pages    
│   │   └── page.js                      # Root page file, likely used for landing or homepage    
│   ├── api/    
│   │   └── check-plan-saved/ [uniqueId]    # GET: Checks if a specific tour plan (based on uniqueId) is already saved for the logged-in user.    
│   │   └── find-place/                     # POST: Fetches places    
│   │   └── generate-plan/                  # POST: Takes user-selected places and generates an optimized tour plan (itinerary), including optimized routes.    
│   │   └── get-plan/ [uniqueId]            # GET: Retrieves details of a saved plan using the uniqueId provided.    
│   │   └── login/                          # POST: Authenticates a user and returns a JWT token upon successful login.     
│   │   └── nearby-places/                  # POST: Finds nearby places to a specific location using Google Places API or similar service.     
│   │   └── plan-route/                     # POST: Optimizes the route between multiple places using a service like Google Directions API.     
│   │   └── register/                       # POST: Registers a new user, storing their details in the database.    
│   │   └── save-plan/                      # POST: Saves a generated tour plan for a logged-in user.    
│   │   └── saved-plans/                    # GET: Fetches all the saved tour plans for the logged-in user.     
│   ├── components/                          
│   │   ├── CitySearch.js                # Component for searching city as trip destinations    
│   │   ├── Header.js                    # Header component used for navigation and branding       
│   │   ├── journeyDetails.js            # Component to display details of a selected journey or plan    
│   │   └── SavePlanButton.js            # Button component to save travel plans to user profiles    
│   ├── lib/                                 
│   │   └── dbConnect.js                 # Utility to manage database connections    
│   ├── login/                           # Login functionality for returning users    
│   │   └── page.js                        
│   ├── models/                            
│   │   ├── Plan.js                      # Model representing travel plans for creating, reading, updating, and deleting plans    
│   │   └── User.js                      # Model for managing user data, such as registration and authentication     
├── .env                                  # Environment variables for sensitive data like API keys

</pre>



# THANK YOU 
