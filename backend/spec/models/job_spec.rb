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

    describe 'form_definitionのバリデーション' do
      it 'form_definitionが必須であること' do
        job = build(:job, form_definition: nil)
        expect(job).not_to be_valid
        expect(job.errors[:form_definition]).to include("can't be blank")
      end

      it 'form_definitionが配列であること' do
        job = build(:job, form_definition: { id: 'name', type: 'text', label: '氏名' })
        expect(job).not_to be_valid
        expect(job.errors[:form_definition]).to include("must be an array")
      end

      it 'form_definitionの各フィールドがハッシュであること' do
        job = build(:job, form_definition: ['invalid'])
        expect(job).not_to be_valid
        expect(job.errors[:form_definition]).to include("field at index 0 must be a hash")
      end

      it 'form_definitionの各フィールドに必須キーが含まれていること' do
        job = build(:job, form_definition: [{ type: 'text', label: '氏名' }])
        expect(job).not_to be_valid
        expect(job.errors[:form_definition]).to include("field at index 0 is missing required keys: id")
      end

      it 'form_definitionの各フィールドの型が有効であること' do
        job = build(:job, form_definition: [{ id: 'name', type: 'invalid', label: '氏名' }])
        expect(job).not_to be_valid
        expect(job.errors[:form_definition]).to include("field at index 0 has invalid type: invalid")
      end

      it 'シンボルキーでも有効なform_definitionを受け入れること' do
        job = build(:job, form_definition: [{ id: 'name', type: :text, label: '氏名' }])
        expect(job).to be_valid
      end
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
