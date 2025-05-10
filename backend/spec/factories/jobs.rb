FactoryBot.define do
  factory :job do
    sequence(:title) { |n| "テスト求人#{n}" }
    description { "テスト求人の説明文です。" }
    location { "東京都" }
    salary { "300,000円〜500,000円" }
    association :company
  end
end 