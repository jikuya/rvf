FactoryBot.define do
  factory :admin do
    sequence(:email) { |n| "admin#{n}@example.com" }
    sequence(:name) { |n| "管理者#{n}" }
    password { "password" }
    password_confirmation { "password" }
  end
end
