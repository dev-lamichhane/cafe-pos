export type MenuItem = {
  id: number
  category: string
  name: string
  desc?: string
  price: string | number
}

export const menuItems = [
  {
    category: 'Coffee',
    name: 'Espresso',
    desc: 'Strong concentrated shot of coffee',
    price: '115',
  },
  {
    category: 'Coffee',
    name: 'Doppio',
    desc: 'Double shot of espresso',
    price: '145',
  },
  {
    category: 'Coffee',
    name: 'Americano (S/D)',
    desc: 'Espresso diluted with hot water',
    price: '150/175',
  },
  {
    category: 'Coffee',
    name: 'Cappuccino',
    desc: 'Espresso with equal parts steamed milk and foam',
    price: '180',
  },
  {
    category: 'Coffee',
    name: 'Cafe Latte (S/D)',
    desc: 'Espresso with steamed milk and a thin layer of foam',
    price: '190/215',
  },
  {
    category: 'Coffee',
    name: 'Cafe Mocha',
    desc: 'Espresso mixed with chocolate and steamed milk',
    price: '280',
  },
  {
    category: 'Coffee',
    name: 'Espresso Macchiato (S/D)',
    desc: 'Espresso topped with a small amount of milk foam',
    price: '125/155',
  },
  {
    category: 'Coffee',
    name: 'Latte Macchiato (S/D)',
    desc: 'Steamed milk topped with a shot of espresso',
    price: '200/220',
  },
  {
    category: 'Coffee',
    name: 'Caramel Macchiato',
    desc: 'Espresso mixed with caramel and steamed milk',
    price: '280',
  },
  {
    category: 'Coffee',
    name: 'Affogato',
    desc: 'A scoop of vanilla ice cream topped with espresso',
    price: '250',
  },
  {
    category: 'Coffee',
    name: 'Mocha Madness',
    desc: 'Blend of espresso, chocolate, caramel, and steamed milk',
    price: '350',
  },
  {
    category: 'Coffee',
    name: 'Flat white',
    desc: 'A smooth, velvety double shot espresso with steamed milk and a thin layer of microfoam',
    price: '220',
  },
  {
    category: 'Coffee',
    name: 'Bullet Coffee',
    desc: 'Rich coffee blended organic ghee',
    price: '220',
  },
  {
    category: 'Iced/Blended Beverage',
    name: 'Iced Americano',
    desc: '',
    price: '200',
  },
  {
    category: 'Iced/Blended Beverage',
    name: 'Iced Cappuccino',
    desc: '',
    price: '220',
  },
  {
    category: 'Iced/Blended Beverage',
    name: 'Iced Latte',
    desc: '',
    price: '230',
  },
  {
    category: 'Iced/Blended Beverage',
    name: 'Iced Mocha',
    desc: '',
    price: '300',
  },
  {
    category: 'Iced/Blended Beverage',
    name: 'Iced Mocha Madness',
    desc: '',
    price: '380',
  },
  {
    category: 'Iced/Blended Beverage',
    name: 'Iced Caramel Macchiato',
    desc: '',
    price: '300',
  },
  {
    category: 'Iced/Blended Beverage',
    name: 'Frappé',
    desc: '',
    price: '335',
  },
  {
    category: 'Iced/Blended Beverage',
    name: 'Virgin Mojito',
    desc: '',
    price: '250',
  },
  {
    category: 'Iced/Blended Beverage',
    name: 'Lemonade/Mint Lemonade',
    desc: '',
    price: '140/170',
  },
  {
    category: 'Iced/Blended Beverage',
    name: 'Milk Shake (Vanilla, Chocolate, Strawberry)',
    desc: '',
    price: '200',
  },
  {
    category: 'Iced/Blended Beverage',
    name: 'Seasonal Smoothie',
    desc: '',
    price: '220',
  },
  {
    category: 'Iced/Blended Beverage',
    name: 'Lassi (Plain/Sweet)',
    desc: '',
    price: '200',
  },
  {
    category: 'Iced/Blended Beverage',
    name: 'Iced Tea (Peach/Lemon)',
    desc: '',
    price: '160',
  },
  {
    category: 'Tea',
    name: 'Milk Tea (Masala)',
    desc: '',
    price: '100',
  },
  {
    category: 'Tea',
    name: 'Black Tea (Masala)',
    desc: '',
    price: '50',
  },
  {
    category: 'Tea',
    name: 'Green Tea/Tulsi Tea',
    desc: '',
    price: '100',
  },
  {
    category: 'Tea',
    name: 'Lemon Tea',
    desc: '',
    price: '70',
  },
  {
    category: 'Tea',
    name: 'Hot Lemon (Ginger, Honey)',
    desc: '',
    price: '175',
  },

  {
    category: 'Tea',
    name: 'Hot Chocolate',
    desc: '',
    price: '200',
  },

  // Breakfast
  {
    category: 'Breakfast',
    name: 'Ghee Toast Scramble Duo',
    desc: 'Fluffy scrambled (two)eggs paired with warm, crispy (two) brown bread toast lightly brushed with natural ghee.',
    price: '195',
  },

  {
    category: 'Breakfast',
    name: 'Yogurt Fruit Bowl',
    desc: 'Creamy yogurt with oats, fresh seasonal fruits, and a crunchy mix of nuts and chia seeds',
    price: '315',
  },

  {
    category: 'Breakfast',
    name: 'Pancake Paradise',
    desc: 'Two fluffy pancakes with seasonal fruits, honey, and a side of scrambled eggs.',
    price: '315',
  },

  // Soups and Salads
  {
    category: 'Soups and Salads',
    name: 'Himalayan Herb Salad',
    desc: 'A bed of fresh lettuce topped with cucumber, onion, tomatoes, and mixed veggies, finished with a touch of Nepali herbs, fresh mint, and a squeeze of lemon.',
    price: '295',
  },
  {
    category: 'Soups and Salads',
    name: 'Seasonal Fruit Delight',
    desc: 'A refreshing mix of seasonal fruits, garnished with chopped nuts and drizzled with natural honey.',
    price: '350',
  },
  {
    category: 'Soups and Salads',
    name: 'Herbed Mushroom Soup',
    desc: 'A rich blend of butter, onion, and garlic, combined with vegetables, all-purpose flour, and aromatic Nepali herbs.',
    price: '350',
  },

  {
    category: 'Soups and Salads',
    name: 'Alpine Chicken Soup',
    desc: 'Tender chicken and fresh vegetables simmered with aromatic Nepali herbs for a comforting, flavorful soup.',
    price: '350',
  },

  // Noodles
  {
    category: 'Noodles',
    name: 'Vegetable Spaghetti with Marinara Sauce',
    desc: 'Spaghetti with homemade marinara, bell peppers, onions, and tomatoes, in a light herb sauce with oregano.',
    price: '295',
  },

  {
    category: 'Noodles',
    name: 'Spaghetti Marinara with Chicken',
    desc: 'Spaghetti with homemade marinara, bell peppers, onions, and tomatoes, topped with tender cooked chicken in a light herb sauce with oregano.',
    price: '350',
  },

  {
    category: 'Noodles',
    name: 'Veg Keema Noodles',
    desc: 'Noodles tossed with minced vegetables and fresh herbs in a flavorful, mildly spiced sauce.',
    price: '275',
  },
  {
    category: 'Noodles',
    name: 'Chicken Keema Noodles',
    desc: 'Noodles tossed with tender minced chicken and fresh vegetables in a flavorful, mildly spiced sauce.',
    price: '295',
  },

  // Burgers and Sandwiches
  {
    category: 'Burgers and Sandwiches',
    name: 'Veggie Cheese Burger',
    desc: 'Toasted bun with a vegetable patty, fresh veggies, creamy mayo, cheese sauce and sliced cheese.',
    price: '250',
  },

  {
    category: 'Burgers and Sandwiches',
    name: 'Classic Chicken Cheese Burger',
    desc: 'Toasted bun with a tender chicken patty, fresh veggies, creamy mayo, cheese sauce and sliced cheese.',
    price: '295',
  },

  {
    category: 'Burgers and Sandwiches',
    name: 'Cheesy Crunch Chicken Burger',
    desc: 'Toasted bun with a crispy chicken patty, fresh veggies, creamy mayo, cheese sauce and sliced cheese.',
    price: '325',
  },
  {
    category: 'Burgers and Sandwiches',
    name: 'Veg Cheese Sandwich',
    desc: 'Toasted bun filled fresh lettuce, cucumber, onion, tomato, creamy mayo, cheese sauce, and sliced cheese.',
    price: '250',
  },
  {
    category: 'Burgers and Sandwiches',
    name: 'Chicken Sandwich',
    desc: 'Toasted bun filled with tender chicken, fresh lettuce, cucumber, onion, tomato, creamy mayo, cheese sauce, and sliced cheese.',
    price: '295',
  },

  // Momo
  {
    category: 'Momo',
    name: 'Veg Momo',
    desc: 'Steamed vegetable dumplings served with spicy chutney.',
    price: '180',
  },
  {
    category: 'Momo',
    name: 'Chicken Momo',
    desc: 'Steamed chicken dumplings served with spicy chutney.',
    price: '220',
  },

  // Veg Snacks

  {
    category: 'Veg Snacks',
    name: 'Aalu Sadeko',
    desc: 'Boiled potato cubes tossed with onions, coriander, carrot, cucumber, chilies, and spices, finished with oil and fenugreek tempering.',
    price: '160',
  },
  {
    category: 'Veg Snacks',
    name: 'Peanuts Sadeko',
    desc: 'Salted peanuts mixed with carrot, cucumber, onions, coriander, chilies, and spices, finished with a oil and fenugreek tempering.',
    price: '180',
  },
  {
    category: 'Veg Snacks',
    name: 'French Fries',
    desc: 'Crispy golden potato fries served with light seasoning.',
    price: '200',
  },
  {
    category: 'Veg Snacks',
    name: 'Chips Chilly',
    desc: 'Crispy chips tossed with onions, coriander, chilies, and spices, finished with a oil and fenugreek tempering.',
    price: '230',
  },
  {
    category: 'Veg Snacks',
    name: 'Mustang Alo',
    desc: 'Crispy fried potatoes tossed in Mustang-style spices for a bold, smoky flavor and Timur seeds tempering.',
    price: '250',
  },

  {
    category: 'Veg Snacks',
    name: 'Paneer Chilly',
    desc: 'Crispy paneer cubes tossed with onions, tomato, capsicum, coriander, chilies, and spices, finished with oil and fenugreek tempering.',
    price: '290',
  },

  // Non-Veg Snacks

  {
    category: 'Non-Veg Snacks',
    name: 'Crispy Fried Chicken',
    desc: 'Juicy chicken pieces marinated in buttermilk, coated in seasoned flour, and fried to golden, crispy perfection.',
    price: '310',
  },

  {
    category: 'Non-Veg Snacks',
    name: 'Chicken Chilly',
    desc: ' Fried chicken tossed with onions, garlic, and a blend of chili powder, cumin, and oregano.',

    price: '280',
  },

  {
    category: 'Extras',
    name: 'Boiled Eggs (Two Eggs)',
    price: '100',
  },

  {
    category: 'Extras',
    name: 'Omelette (Two Eggs)',
    price: '125',
  },

  {
    category: 'Extras',
    name: 'Chicken Sausages (Two Pieces)',
    price: '120',
  },

  {
    category: 'Extras',
    name: 'Toast (Two Slices)',
    price: '30',
  },
]
