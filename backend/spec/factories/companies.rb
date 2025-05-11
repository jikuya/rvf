FactoryBot.define do
  factory :company do
    sequence(:name) { |n| "テスト企業#{n}" }
    sequence(:email) { |n| "company#{n}@example.com" }
    password { 'password' }
    password_confirmation { 'password' }
  end
end
