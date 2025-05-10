class JobApplication < ApplicationRecord
  belongs_to :job
  has_one_attached :resume

  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :resume, presence: true
end
