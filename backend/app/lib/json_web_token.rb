module JsonWebToken
  puts "Rails.env: #{Rails.env}"
  puts "Rails.env.test?: #{Rails.env.test?}"
  SECRET_KEY = if Rails.env.test?
    'test_secret_key_base_for_jwt_token_verification'
  else
    ENV['SECRET_KEY_BASE'] || Rails.application.credentials.secret_key_base
  end
  puts "SECRET_KEY: #{SECRET_KEY}"

  def self.encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY)
  end

  def self.decode(token)
    puts "Decoding token: #{token}"
    puts "Using SECRET_KEY: #{SECRET_KEY}"
    begin
      decoded = JWT.decode(token, SECRET_KEY)[0]
      puts "Decoded payload: #{decoded}"
      HashWithIndifferentAccess.new decoded
    rescue JWT::DecodeError => e
      puts "JWT::DecodeError: #{e.message}"
      nil
    end
  end
end 