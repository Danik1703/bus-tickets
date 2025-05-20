# Bus Ticket Booking Application - README.md

## Overview

This Angular application is designed to allow users to search for and potentially book bus tickets. It includes features for browsing available routes, viewing schedules, and interacting with a map to visualize destinations. The application also incorporates user interface enhancements, data fetching from a service, and potentially features like tracking routes and sending email notifications.

## Project Structure

The project follows a standard Angular structure, with key components and services organized within their respective directories.

## File Breakdown

### 1. `app.component.ts`

- **Purpose:** The root component of the Angular application. It acts as the main container for the application's content, using the `<router-outlet>` directive to display different views based on the current route.
- **Key Code:**
  - Imports the `Component` decorator from `@angular/core`.
  - `@Component({...})`: Defines the component's metadata, including the selector (`bus-tickets`), template (`<router-outlet></router-outlet>`), and associated stylesheet (`./app.component.scss`).
  - `export class AppComponent { title = 'bus-tickets'; }`: Defines the `AppComponent` class with a `title` property.

### 2. `app.component.html`

- **Purpose:** The template for the `AppComponent`.
- **Key Code:**
  - `<router-outlet></router-outlet>`: This directive from `@angular/router` marks the place in the template where the content of the currently active route will be rendered.

### 3. `app.component.scss`

- **Purpose:** Stylesheet for the `AppComponent`.
- **Key Code:**
  - Styles for the `body` element (font, margins, padding, background color).
  - Styles for a `nav` element (display, alignment, background, padding) - note that there is no `<nav>` element in the `app.component.html`, so these styles might be intended for a navigation element in another component.
  - Styles for the `app-root` element (top margin).

### 4. `app.component.spec.ts`

- **Purpose:** Unit tests for the `AppComponent`.
- **Key Code:**
  - Includes tests to ensure the component is created successfully and that its `title` property is set correctly.
  - Contains a test (`should render title`) that seems to expect the component's template to directly render the title, which is not the case based on `app.component.html`. This test might be outdated or intended for a different template structure.

### 5. `app.module.ts`

- **Purpose:** The main module of the Angular application, responsible for importing and configuring other modules, components, and services.
- **Key Code:**
  - Imports various Angular modules (`BrowserModule`, `AppRoutingModule`, `FormsModule`, `HttpClientModule`, `CommonModule`, `BrowserAnimationsModule`), Angular Material modules (`MatDatepickerModule`, `MatInputModule`, `MatFormFieldModule`, `MatNativeDateModule`, `MatButtonModule`), a third-party timepicker module (`NgxMaterialTimepickerModule`), a translation module (`TranslateModule`), RxJS operators (`forkJoin`, `of`, `catchError`), and custom UI kit modules (`MefDevCardModule`, `MefDevSelectModule`).
  - Declares the application's components: `AppComponent`, `MainComponent`, and `BusServiceComponent`.
  - Imports necessary modules for the application's functionality and UI.
  - Configures providers, including the `BusService`, an `APP_INITIALIZER` function (`init`) for setting the application language, and the `APP_BASE_HREF`.
  - Bootstraps the `AppComponent` to start the application.
  - Uses `CUSTOM_ELEMENTS_SCHEMA` to allow the use of custom HTML elements.
  - The `init` function uses `forkJoin` to perform initialization tasks in parallel, including setting the application's language based on local storage or defaulting to 'en'.

### 6. `app-routing.module.ts`

- **Purpose:** Defines the routing configuration for the application, mapping URLs to specific components.
- **Key Code:**
  - Defines an array of `Routes`:
    - The default path (`''`) is configured with a nested route that renders the `MainComponent`.
    - The path `/bus-service` renders the `BusServiceComponent`.
    - A wildcard route (`'**'`) redirects any unknown paths back to the default path.
  - Imports and configures the `RouterModule` with the defined routes.

### 7. `bus-service.component.ts`

- **Purpose:** A component likely responsible for displaying bus schedules, handling search functionality, displaying reviews, tracking routes, and interacting with a map.
- **Key Code:**
  - Imports necessary modules and services, including custom services (`SuccessMessageService`, `BusService`), UI components (`MefDevCardModule`), a map library (`leaflet`), a routing machine for the map (`leaflet-routing-machine`), a notification library (`sweetalert2`), and an email sending library (`emailjs`).
  - Defines an interface `Review` for review data.
  - Declares various properties: `userId`, `userEmail`, `busSchedules`, `searchQuery`, `searchSuggestions`, `isSuggestionsVisible`, `reviews`, `trackedRoutes`, arrays for review texts and authors, `filters` for search criteria, an array of `buses` with route information, an array of `destinations` with coordinates, properties for discount messages and email validation, a `map` instance, selected coordinates for origin and destination, and a route control for the map.
  - The `constructor` injects the `BusService`, `SuccessMessageService`, and `PlatformHelper`.
  - `ngOnInit` initializes reviews and the map.
  - `getAsset` retrieves asset URLs.
  - `generateReviews` creates a list of random reviews.
  - `trackRoute` adds a route to the tracked routes and displays a success message.
  - `removeTrackedRoute` removes a route from the tracked routes.
  - `updateSearchSuggestions` fetches search suggestions based on the `searchQuery`.

### 8. `bus-service.component.html`

- **Purpose:** The template for the `BusServiceComponent`, defining its UI structure.
- **Key Code:**
  - Contains elements for searching bus routes (input field, potentially with suggestions).
  - Includes a section to display bus schedules, likely iterating over the `buses` array.
  - Implements filtering options for routes (from, to, date, time, price, bus type).
  - Provides functionality to sort the displayed bus routes.
  - Includes a map container (`div` with ID `map`) to visualize destinations and routes.
  - Displays a section for user reviews.
  - Features for tracking bus routes and displaying tracked routes.
  - Elements for email subscription and displaying discount messages.

### 9. `bus-service.component.scss`

- **Purpose:** Stylesheet for the `BusServiceComponent`.
- **Key Code:**
  - Contains styles for various elements within the component, including the search bar, bus schedule display, filters, map container, reviews section, and tracked routes.
  - Likely includes styling for layout, typography, colors, and responsiveness.

### 10. `bus.service.ts`

- **Purpose:** A service responsible for fetching bus-related data, such as schedules and search suggestions, likely by making HTTP requests to a backend API.
- **Key Code:**
  - Imports `HttpClient` from `@angular/common/http` and `Observable` from `rxjs`.
  - Defines methods like `getBusSchedules()` (though its implementation is not fully shown) and `getSearchSuggestions(query: string)` which makes a GET request to an API endpoint to retrieve search suggestions based on the provided query.
  - Includes error handling using the `pipe` and `catchError` operators on the HTTP request.

### 11. `main.component.ts`

- **Purpose:** A component that likely serves as the main landing page or dashboard of the application.
- **Key Code:**
  - Imports `Component` and `OnInit` from `@angular/core`.
  - Implements the `OnInit` interface.
  - `constructor()`: The constructor is empty in the provided code.
  - `ngOnInit()`: The `ngOnInit` lifecycle hook is empty, indicating no specific initialization logic when the component is created.

### 12. `main.component.html`

- **Purpose:** The template for the `MainComponent`, defining its UI structure.
- **Key Code:**
  - Contains a main title (`<h1>`).
  - Includes a navigation section (`<nav>`) with links to different parts of the application ("Головна" and "Сервіс").
  - Displays a welcome message (`<p>`).
  - Features a section for "Our Services" with a card component (`<mef-dev-card>`) likely from the `@natec/mef-dev-ui-kit`. This card displays an image, a title ("Bus Tickets"), and a description.

### 13. `main.component.scss`

- **Purpose:** Stylesheet for the `MainComponent`.
- **Key Code:**
  - Styles the main title (`h1`) for centering and margin.
  - Styles the navigation (`nav`) for centering, background color, and padding.
  - Styles the navigation links (`nav a`) for margin, text color, and text decoration.
  - Styles the welcome message (`.welcome-message`) for margin and font size.
  - Styles the "Our Services" section (`.our-services`) for layout and margin.

### 14. `reminder.service.ts`

- **Purpose:** A service that manages reminders, likely for upcoming bus trips.
- **Key Code:**
  - Imports `Injectable` from `@angular/core` and `Subject` and `Observable` from `rxjs`.
  - Uses a `Subject` (`reminderAddedSource`) to emit events when a reminder is added.
  - Provides an observable (`reminderAdded$`) to subscribe to reminder added events.
  - Includes an `addReminder(message: string)` method to add a reminder (currently only emits a message) and a `getReminders()` method (currently empty).

### 15. `reminder.service.spec.ts`

- **Purpose:** Unit tests for the `ReminderService`.
- **Key Code:**
  - Includes tests to check if the service is created and if the `addReminder` method correctly emits a message through the `reminderAdded$` observable.

### 16. `success-message.service.ts`

- **Purpose:** A service for displaying and managing success messages within the application.
- **Key Code:**
  - Imports `Injectable` from `@angular/core` and `Subject` and `Observable` from `rxjs`.
  - Uses a `Subject` (`messageSource`) to emit success messages.
  - Provides an observable (`message$`) to subscribe to these messages.
  - Includes a `sendMessage(message: string)` method to emit a new success message.

This README provides a high-level overview of the project structure and a detailed breakdown of each provided file, explaining its purpose and key code snippets. You can use this information to understand the functionality and organization of the Bus Ticket Booking Angular application.