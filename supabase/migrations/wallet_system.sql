-- Create wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL UNIQUE,
  balance DECIMAL(10, 2) DEFAULT 0,
  total_added DECIMAL(10, 2) DEFAULT 0,
  total_spent DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('credit', 'debit')),
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  balance_before DECIMAL(10, 2) NOT NULL,
  balance_after DECIMAL(10, 2) NOT NULL,
  video_gen_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create video_generations table
CREATE TABLE IF NOT EXISTS video_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  model_id VARCHAR(255) NOT NULL,
  model_name VARCHAR(255) NOT NULL,
  prompt TEXT NOT NULL,
  duration INT DEFAULT 5,
  api_cost DECIMAL(10, 2) NOT NULL,
  commission DECIMAL(10, 2) NOT NULL,
  total_cost DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  job_id VARCHAR(255),
  provider VARCHAR(255),
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_video_generations_user_id ON video_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_video_generations_created_at ON video_generations(created_at DESC);

-- Set up Row Level Security (RLS)
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_generations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for wallets
CREATE POLICY "Users can view their own wallet" ON wallets
  FOR SELECT USING (user_id = current_user_id());

CREATE POLICY "Service role can manage all wallets" ON wallets
  FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for transactions
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (user_id = current_user_id());

CREATE POLICY "Service role can manage all transactions" ON transactions
  FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for video_generations
CREATE POLICY "Users can view their own video generations" ON video_generations
  FOR SELECT USING (user_id = current_user_id());

CREATE POLICY "Service role can manage all video generations" ON video_generations
  FOR ALL USING (auth.role() = 'service_role');