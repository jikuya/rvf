require 'rails_helper'

RSpec.describe JobApplication, type: :model do
  describe 'バリデーション' do
    it '有効なファクトリーを持つこと' do
      expect(build(:job_application)).to be_valid
    end

    it '名前が必須であること' do
      application = build(:job_application, name: nil)
      expect(application).not_to be_valid
      expect(application.errors[:name]).to include("can't be blank")
    end

    it 'メールアドレスが必須であること' do
      application = build(:job_application, email: nil)
      expect(application).not_to be_valid
      expect(application.errors[:email]).to include("can't be blank")
    end

    it 'メールアドレスが正しい形式であること' do
      application = build(:job_application, email: 'invalid_email')
      expect(application).not_to be_valid
      expect(application.errors[:email]).to include("is invalid")
    end

    it '求人が必須であること' do
      application = build(:job_application, job: nil)
      expect(application).not_to be_valid
      expect(application.errors[:job]).to include("must exist")
    end

    it 'ステータスが必須であること' do
      application = build(:job_application, status: nil)
      expect(application).not_to be_valid
      expect(application.errors[:status]).to include("can't be blank")
    end

    it 'ステータスが有効な値であること' do
      application = build(:job_application, status: 'invalid_status')
      expect(application).not_to be_valid
      expect(application.errors[:status]).to include("is not included in the list")
    end
  end

  describe 'アソシエーション' do
    it '求人に属すること' do
      expect(JobApplication.reflect_on_association(:job).macro).to eq :belongs_to
    end
  end
end
