 ll# How to Add a "Favorites" Feature to HappyFarmer

This guide walks you through implementing the "Favorites" (or Wishlist) functionality. We'll start with the backend (where the data is saved) and move to the frontend (the visual heart button).

## Part 1: Backend (Java/Spring)

We need to store which users like which products. This is a **Many-to-Many** relationship:
- One User can like **Many** Products.
- One Product can be liked by **Many** Users.

### 1. Update the User Entity
Open `backend/src/main/java/com/happyfarmer/backend/models/User.java`.
Add a `favorites` set to store the products a user likes.

```java
// ... imports
import java.util.Set;
import java.util.HashSet;

// ... inside public class User {

    @ManyToMany(fetch = FetchType.EAGER) // Eager so we get favorites when we load the user
    @JoinTable(
        name = "user_favorites",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private Set<Product> favorites = new HashSet<>();

// ...
```

### 2. Update the User Service
Open `backend/src/main/java/com/happyfarmer/backend/services/UserService.java`.
Add methods to handle adding and removing favorites.

```java
// ... imports

public void addFavorite(UUID userId, UUID productId) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

    user.getFavorites().add(product);
    userRepository.save(user);
}

public void removeFavorite(UUID userId, UUID productId) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

    user.getFavorites().remove(product);
    userRepository.save(user);
}

public Set<Product> getFavorites(UUID userId) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    return user.getFavorites();
}
```

### 3. Create/Update Controller
Open `backend/src/main/java/com/happyfarmer/backend/controllers/UserController.java`.
Add endpoints to call the service methods.

```java
// ... imports

@PostMapping("/{id}/favorites/{productId}")
public ResponseEntity<?> addFavorite(@PathVariable UUID id, @PathVariable UUID productId) {
    userService.addFavorite(id, productId);
    return ResponseEntity.ok().body(Map.of("message", "Product added to favorites"));
}

@DeleteMapping("/{id}/favorites/{productId}")
public ResponseEntity<?> removeFavorite(@PathVariable UUID id, @PathVariable UUID productId) {
    userService.removeFavorite(id, productId);
    return ResponseEntity.ok().body(Map.of("message", "Product removed from favorites"));
}

@GetMapping("/{id}/favorites")
public ResponseEntity<?> getFavorites(@PathVariable UUID id) {
    return ResponseEntity.ok(userService.getFavorites(id));
}
```

---

## Part 2: Frontend (React)

Now we need to update the React app to let users click the heart and see their favorites.

### 1. Update API Service
Open `frontend/src/services/api.js` and add these functions:

```javascript
// Favorites API
export const getFavorites = async (userId) => {
  const response = await api.get(`/users/${userId}/favorites`);
  return response.data;
};

export const addFavorite = async (userId, productId) => {
  const response = await api.post(`/users/${userId}/favorites/${productId}`);
  return response.data;
};

export const removeFavorite = async (userId, productId) => {
  const response = await api.delete(`/users/${userId}/favorites/${productId}`);
  return response.data;
};
```

### 2. Manage State (The Logic)
The best place to handle this logic is in `AuthContext` or a new `FavoritesContext`. For simplicity, let's update `frontend/src/context/AuthContext.jsx` to fetch favorites when the user logs in.

*Alternately, you can just fetch favorites in `ProductCard` but that causes many API calls. A "Context" approach is better.*

**Simplified Approach for Learning:**
We will manage the "Is Favorite" state directly in the `ProductCard` component first, but fetch the initial list in the parent `Home` or `Shop` page.

However, the **Pro way** is to add it to `AuthContext`:

**In `AuthContext.jsx`:**
1. Add `favorites` state: `const [favorites, setFavorites] = useState([]);`
2. When loading user, fetch favorites IDs.
3. Expose `toggleFavorite` function that calls the API and updates local state.

### 3. Update the ProductCard UI
Open `frontend/src/components/ProductCard.jsx`.

Currently, it has:
```jsx
{/* Wishlist Button (Aesthetic only for now) */}
<button className="...">
    <Heart size={18} />
</button>
```

Update it to be functional:

```jsx
// ... imports
import { useAuth } from '../context/AuthContext'; // If you put logic there
import { Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
    // Determine if this product is liked
    // This example assumes you passed 'isFavorite' prop or use a context
    const [isLiked, setIsLiked] = React.useState(false); 
    
    const handleToggleFavorite = (e) => {
        e.stopPropagation(); // Prevent clicking the card itself
        setIsLiked(!isLiked);
        // TODO: Call API here
    };

    return (
        // ...
            <button 
                onClick={handleToggleFavorite}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 shadow-sm 
                    ${isLiked ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400 hover:text-red-500'}`}
            >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            </button>
        // ...
    );
};
```

## Summary Checklist
- [ ] Add `favorites` field to Java `User` model.
- [ ] Add `add/remove` methods in Java `UserService`.
- [ ] Add endpoints in `UserController`.
- [ ] Add API calls in JS `api.js`.
- [ ] Update `ProductCard` to handle clicks and show red heart.
