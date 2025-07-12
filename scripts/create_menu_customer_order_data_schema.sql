-- Complete schema for Menu Data, Customer Data, and Order Data
-- Based on the provided field specifications

-- Menu Data Tables
CREATE TABLE IF NOT EXISTS menu_categories (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    restaurant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    restaurant_id TEXT NOT NULL,
    category_id TEXT NOT NULL REFERENCES menu_categories(id),
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('available', 'oos')) DEFAULT 'available',
    category TEXT, -- Category selection
    tag_taste TEXT, -- Free text
    tag_promote TEXT, -- Free text
    type_prep TEXT, -- Free text
    images TEXT[], -- Array of image URLs
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_data (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    restaurant_id TEXT NOT NULL,
    categories JSONB DEFAULT '[]',
    items JSONB DEFAULT '[]',
    last_sync_at TIMESTAMP WITH TIME ZONE,
    completion_status JSONB DEFAULT '{"categories": false, "items": false, "overall": 0}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT menu_data_user_id_key UNIQUE(user_id)
);

-- Customer Data Tables
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    restaurant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    phone_no TEXT NOT NULL,
    email TEXT,
    age INTEGER,
    total_no_of_orders INTEGER DEFAULT 0,
    ltv DECIMAL(10, 2) DEFAULT 0, -- Lifetime Value
    avg_spend DECIMAL(10, 2) DEFAULT 0,
    last_order_date DATE,
    first_order_date DATE,
    order_frequency TEXT CHECK (order_frequency IN ('annual', 'monthly', 'weekly', 'daily')),
    frequency_segment TEXT CHECK (frequency_segment IN ('occasional', 'regular', 'loyal')),
    aov_segment TEXT CHECK (aov_segment IN ('low', 'normal', 'premium')), -- Average Order Value
    ltv_segment TEXT CHECK (ltv_segment IN ('new', 'common', 'vip')),
    churn_status TEXT CHECK (churn_status IN ('new', 'active', 'inactive')),
    items_ordered_list JSONB DEFAULT '[]',
    week_order_pattern JSONB DEFAULT '[]',
    order_slot_pattern JSONB DEFAULT '[]',
    ai_insights JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_segments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    restaurant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    criteria JSONB NOT NULL,
    customer_count INTEGER DEFAULT 0,
    total_value DECIMAL(10, 2) DEFAULT 0,
    avg_order_value DECIMAL(10, 2) DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_data (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    restaurant_id TEXT NOT NULL,
    customers JSONB DEFAULT '[]',
    segments JSONB DEFAULT '[]',
    analytics JSONB DEFAULT '{}',
    last_sync_at TIMESTAMP WITH TIME ZONE,
    completion_status JSONB DEFAULT '{"customers": false, "segments": false, "analytics": false, "overall": 0}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT customer_data_user_id_key UNIQUE(user_id)
);

-- Order Data Tables
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_no TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    restaurant_id TEXT NOT NULL,
    customer_id TEXT REFERENCES customers(id),
    customer_name TEXT,
    customer_phone TEXT,
    order_slot TEXT CHECK (order_slot IN ('bf', 'lunch', 'snack', 'dinner', 'midnight')) NOT NULL,
    no_of_items INTEGER NOT NULL,
    item_list JSONB NOT NULL DEFAULT '[]',
    free_items_list JSONB DEFAULT '[]',
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    discount_percentage DECIMAL(5, 2) DEFAULT 0,
    bill_amount DECIMAL(10, 2) NOT NULL,
    service_fee_amount DECIMAL(10, 2) DEFAULT 0,
    service_fee_percentage DECIMAL(5, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    tax_percentage DECIMAL(5, 2) DEFAULT 0,
    final_amount DECIMAL(10, 2) NOT NULL,
    order_date DATE NOT NULL,
    order_time TIME NOT NULL,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')) DEFAULT 'pending',
    payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
    order_source TEXT CHECK (order_source IN ('dine-in', 'takeaway', 'delivery', 'online')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id),
    menu_item_id TEXT,
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    customizations TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_data (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    restaurant_id TEXT NOT NULL,
    orders JSONB DEFAULT '[]',
    analytics JSONB DEFAULT '{}',
    last_sync_at TIMESTAMP WITH TIME ZONE,
    completion_status JSONB DEFAULT '{"orders": false, "analytics": false, "overall": 0}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT order_data_user_id_key UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_categories_user_id ON menu_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_menu_categories_restaurant_id ON menu_categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_user_id ON menu_items(user_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_status ON menu_items(status);

CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_restaurant_id ON customers(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone_no ON customers(phone_no);
CREATE INDEX IF NOT EXISTS idx_customers_frequency_segment ON customers(frequency_segment);
CREATE INDEX IF NOT EXISTS idx_customers_churn_status ON customers(churn_status);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_order_slot ON orders(order_slot);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_source ON orders(order_source);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_menu_categories_updated_at BEFORE UPDATE ON menu_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_data_updated_at BEFORE UPDATE ON menu_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_segments_updated_at BEFORE UPDATE ON customer_segments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_data_updated_at BEFORE UPDATE ON customer_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_data_updated_at BEFORE UPDATE ON order_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO menu_data (
    id, user_id, restaurant_id,
    categories, items,
    completion_status
) VALUES (
    'menu_sample_001', 'user_123', 'restaurant_sample_001',
    '[
        {"id": "cat_001", "name": "Appetizers", "description": "Start your meal right", "displayOrder": 1, "isActive": true},
        {"id": "cat_002", "name": "Main Course", "description": "Our signature dishes", "displayOrder": 2, "isActive": true}
    ]',
    '[
        {
            "id": "item_001", "categoryId": "cat_001", "name": "Bruschetta", "price": 12.99,
            "description": "Fresh tomatoes, basil, and mozzarella on toasted bread",
            "status": "available", "category": "Appetizers", "tagTaste": "Fresh, Savory",
            "tagPromote": "Popular", "typePrep": "Grilled", "images": [], "isActive": true, "displayOrder": 1
        },
        {
            "id": "item_002", "categoryId": "cat_002", "name": "Margherita Pizza", "price": 18.99,
            "description": "Classic pizza with fresh mozzarella, tomatoes, and basil",
            "status": "available", "category": "Main Course", "tagTaste": "Classic, Cheesy",
            "tagPromote": "Chef Special", "typePrep": "Baked", "images": [], "isActive": true, "displayOrder": 1
        }
    ]',
    '{"categories": true, "items": true, "overall": 100}'
) ON CONFLICT (user_id) DO NOTHING;

INSERT INTO customer_data (
    id, user_id, restaurant_id,
    customers, analytics,
    completion_status
) VALUES (
    'customer_sample_001', 'user_123', 'restaurant_sample_001',
    '[
        {
            "id": "cust_001", "name": "John Doe", "phoneNo": "9876543210", "email": "john@example.com",
            "age": 32, "totalNoOfOrders": 15, "ltv": 450.75, "avgSpend": 30.05,
            "lastOrderDate": "2024-01-15", "firstOrderDate": "2023-06-01",
            "orderFrequency": "monthly", "frequencySegment": "regular", "aovSegment": "normal",
            "ltvSegment": "common", "churnStatus": "active",
            "itemsOrderedList": [
                {"itemId": "item_001", "itemName": "Bruschetta", "orderCount": 8, "totalSpent": 103.92, "lastOrderDate": "2024-01-15"},
                {"itemId": "item_002", "itemName": "Margherita Pizza", "orderCount": 12, "totalSpent": 227.88, "lastOrderDate": "2024-01-10"}
            ],
            "weekOrderPattern": [
                {"dayOfWeek": "friday", "orderCount": 6, "totalSpent": 180.30},
                {"dayOfWeek": "saturday", "orderCount": 9, "totalSpent": 270.45}
            ],
            "orderSlotPattern": [
                {"slot": "dinner", "orderCount": 12, "totalSpent": 360.60},
                {"slot": "lunch", "orderCount": 3, "totalSpent": 90.15}
            ],
            "aiInsights": {
                "orderingPattern": "Regular weekend diner with preference for dinner slots",
                "preferences": ["Bruschetta", "Margherita Pizza", "Italian Cuisine"],
                "predictedChurnRisk": "low",
                "recommendedItems": ["Pasta Carbonara", "Tiramisu"],
                "bestContactTime": "7:00 PM - 9:00 PM",
                "preferredOrderSlot": "dinner",
                "seasonalTrends": ["Orders more comfort food in winter"]
            }
        }
    ]',
    '{"totalCustomers": 1, "activeCustomers": 1, "newCustomers": 0, "churnedCustomers": 0, "avgLTV": 450.75, "avgOrderValue": 30.05}',
    '{"customers": true, "segments": false, "analytics": true, "overall": 67}'
) ON CONFLICT (user_id) DO NOTHING;

INSERT INTO order_data (
    id, user_id, restaurant_id,
    orders, analytics,
    completion_status
) VALUES (
    'order_sample_001', 'user_123', 'restaurant_sample_001',
    '[
        {
            "id": "order_001", "orderNo": "ORD-2024-001", "customerId": "cust_001",
            "customerName": "John Doe", "customerPhone": "9876543210",
            "orderSlot": "dinner", "noOfItems": 2,
            "itemList": [
                {"id": "oi_001", "menuItemId": "item_001", "name": "Bruschetta", "price": 12.99, "quantity": 1, "totalPrice": 12.99},
                {"id": "oi_002", "menuItemId": "item_002", "name": "Margherita Pizza", "price": 18.99, "quantity": 1, "totalPrice": 18.99}
            ],
            "freeItemsList": [],
            "discount": {"amount": 3.20, "percentage": 10},
            "billAmount": 31.98, "serviceFee": {"amount": 1.60, "percentage": 5},
            "taxAmount": {"amount": 2.88, "percentage": 9}, "finalAmount": 33.26,
            "orderDate": "2024-01-15", "orderTime": "19:30:00",
            "status": "delivered", "paymentStatus": "paid", "orderSource": "dine-in"
        }
    ]',
    '{"totalOrders": 1, "totalRevenue": 33.26, "avgOrderValue": 33.26, "topSellingItems": [{"itemName": "Margherita Pizza", "quantity": 1, "revenue": 18.99}]}',
    '{"orders": true, "analytics": true, "overall": 100}'
) ON CONFLICT (user_id) DO NOTHING;
