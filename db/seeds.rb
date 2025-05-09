# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# テスト用の会社を作成
company = Company.create!(
  name: '株式会社テスト',
  email: 'test@example.com',
  password: 'password',
  password_confirmation: 'password'
)

# テスト用の求人を作成
jobs = [
  {
    title: 'フロントエンドエンジニア',
    description: 'Reactを使用したWebアプリケーションの開発。React、TypeScriptの経験必須。勤務地：東京都渋谷区。年収500万円〜800万円。正社員。',
    company: company
  },
  {
    title: 'バックエンドエンジニア',
    description: 'Ruby on Railsを使用したAPI開発。Ruby、Railsの経験必須。勤務地：東京都新宿区。年収600万円〜900万円。正社員。',
    company: company
  },
  {
    title: 'フルスタックエンジニア',
    description: 'フロントエンドとバックエンドの両方の開発。React、Ruby on Railsの経験必須。リモート勤務可。年収700万円〜1000万円。正社員。',
    company: company
  }
]

created_jobs = jobs.map do |job_attrs|
  Job.create!(job_attrs)
end

# テスト用のファイルを作成
require 'tempfile'

def create_test_file(filename)
  file = Tempfile.new([filename, '.pdf'])
  file.write('Test resume content')
  file.rewind
  file
end

# テスト用の応募を作成
job = created_jobs.first
applications = [
  {
    name: '山田太郎',
    email: 'yamada@example.com',
    status: 'pending',
    job: job,
    company: company
  },
  {
    name: '鈴木花子',
    email: 'suzuki@example.com',
    status: 'screening',
    job: job,
    company: company
  },
  {
    name: '佐藤次郎',
    email: 'sato@example.com',
    status: 'interview',
    job: job,
    company: company
  }
]

applications.each do |application_attrs|
  application = Application.new(application_attrs)
  file = create_test_file('resume')
  application.resume.attach(
    io: file,
    filename: 'resume.pdf',
    content_type: 'application/pdf'
  )
  application.save!
  file.close
  file.unlink
end

puts 'シードデータの作成が完了しました。'
