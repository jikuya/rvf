require 'rails_helper'

RSpec.describe Company, type: :model do
  describe 'バリデーション' do
    it '有効なファクトリーを持つこと' do
      expect(build(:company)).to be_valid
    end

    it '名前が必須であること' do
      company = build(:company, name: nil)
      expect(company).not_to be_valid
      expect(company.errors[:name]).to include("can't be blank")
    end

    it 'メールアドレスが必須であること' do
      company = build(:company, email: nil)
      expect(company).not_to be_valid
      expect(company.errors[:email]).to include("can't be blank")
    end

    it 'メールアドレスが一意であること' do
      create(:company, email: 'test@example.com')
      company = build(:company, email: 'test@example.com')
      expect(company).not_to be_valid
      expect(company.errors[:email]).to include("has already been taken")
    end

    it 'メールアドレスが正しい形式であること' do
      company = build(:company, email: 'invalid_email')
      expect(company).not_to be_valid
      expect(company.errors[:email]).to include("is invalid")
    end

    it 'パスワードが必須であること' do
      company = build(:company, password: nil)
      expect(company).not_to be_valid
      expect(company.errors[:password]).to include("can't be blank")
    end
  end
end 