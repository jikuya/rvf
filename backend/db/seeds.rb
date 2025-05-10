# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# テスト用企業アカウント
company = Company.create!(
  name: 'テスト企業',
  email: 'test@example.com',
  password: 'password',
  password_confirmation: 'password'
)

# テスト用求人
5.times do |i|
  job = company.jobs.create!(
    title: "テスト求人#{i + 1}",
    description: "テスト求人#{i + 1}の説明文です。\n\n【業務内容】\n・テスト業務\n・テスト開発\n\n【必須スキル】\n・テストスキル\n・テスト経験",
    location: ['東京都', '大阪府', '福岡県'].sample,
    salary: ['300,000円〜500,000円', '400,000円〜600,000円', '500,000円〜700,000円'].sample
  )

  # テスト用応募
  3.times do |j|
    application = job.job_applications.create!(
      name: "応募者#{i * 3 + j + 1}",
      email: "applicant#{i * 3 + j + 1}@example.com",
      status: ['pending', 'reviewing', 'accepted', 'rejected'].sample
    )

    # テスト用履歴書
    application.resume.attach(
      io: File.open(Rails.root.join('spec', 'fixtures', 'files', 'sample_resume.pdf')),
      filename: 'sample_resume.pdf',
      content_type: 'application/pdf'
    )
  end
end

puts 'シードデータの作成が完了しました。'
