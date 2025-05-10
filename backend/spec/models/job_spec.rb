require 'rails_helper'

RSpec.describe Job, type: :model do
  describe 'バリデーション' do
    it '有効なファクトリーを持つこと' do
      expect(build(:job)).to be_valid
    end

    it 'タイトルが必須であること' do
      job = build(:job, title: nil)
      expect(job).not_to be_valid
      expect(job.errors[:title]).to include("can't be blank")
    end

    it '説明が必須であること' do
      job = build(:job, description: nil)
      expect(job).not_to be_valid
      expect(job.errors[:description]).to include("can't be blank")
    end

    it '勤務地が必須であること' do
      job = build(:job, location: nil)
      expect(job).not_to be_valid
      expect(job.errors[:location]).to include("can't be blank")
    end

    it '給与が必須であること' do
      job = build(:job, salary: nil)
      expect(job).not_to be_valid
      expect(job.errors[:salary]).to include("can't be blank")
    end

    it '企業が必須であること' do
      job = build(:job, company: nil)
      expect(job).not_to be_valid
      expect(job.errors[:company]).to include("must exist")
    end
  end

  describe 'アソシエーション' do
    it '企業に属すること' do
      expect(Job.reflect_on_association(:company).macro).to eq :belongs_to
    end

    it '応募情報を持つこと' do
      expect(Job.reflect_on_association(:job_applications).macro).to eq :has_many
    end
  end
end 