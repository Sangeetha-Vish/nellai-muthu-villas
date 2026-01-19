-- Insert Products
INSERT INTO Product (id, name, description, image, price, weight, tradition, available, createdAt, updatedAt) VALUES
('prod_001', 'Mysore Pak', 'Traditional ghee-based sweet with a melt-in-mouth texture', '/images/mysore-pak.jpg', 450, '500g', 'Prepared using the authentic recipe passed down through generations', 1, datetime('now'), datetime('now')),
('prod_002', 'Badam Halwa', 'Rich almond halwa made with pure ghee and premium almonds', '/images/badam-halwa.jpg', 650, '500g', 'Slow-cooked for hours to achieve the perfect consistency', 1, datetime('now'), datetime('now')),
('prod_003', 'Kaju Katli', 'Diamond-shaped cashew fudge with a delicate sweetness', '/images/kaju-katli.jpg', 750, '500g', 'Made with the finest cashews and traditional methods', 1, datetime('now'), datetime('now')),
('prod_004', 'Gulab Jamun', 'Soft milk-solid dumplings soaked in rose-flavored syrup', '/images/gulab-jamun.jpg', 350, '500g', 'Served warm for the best experience', 1, datetime('now'), datetime('now')),
('prod_005', 'Jangiri', 'Crispy, coiled sweet with a vibrant orange color', '/images/jangiri.jpg', 400, '500g', 'A festival favorite, prepared fresh daily', 1, datetime('now'), datetime('now')),
('prod_006', 'Milk Peda', 'Soft, creamy milk sweet with cardamom flavor', '/images/milk-peda.jpg', 380, '500g', 'Made from pure milk and traditional recipes', 1, datetime('now'), datetime('now'));

-- Insert Branches
INSERT INTO Branch (id, name, location, area, timings, distance, createdAt, updatedAt) VALUES
('branch_001', 'RS Puram', '123 Avinashi Road, RS Puram', 'RS Puram', '8:00 AM - 9:00 PM', '2.5 km', datetime('now'), datetime('now')),
('branch_002', 'Gandhipuram', '456 Cross Cut Road, Gandhipuram', 'Gandhipuram', '8:00 AM - 9:30 PM', '3.8 km', datetime('now'), datetime('now')),
('branch_003', 'Saibaba Colony', '789 Trichy Road, Saibaba Colony', 'Saibaba Colony', '7:30 AM - 9:00 PM', '4.2 km', datetime('now'), datetime('now'));
