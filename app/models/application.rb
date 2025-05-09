class Application < ApplicationRecord
  belongs_to :job
  belongs_to :company

  has_one_attached :resume

  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :status, presence: true, inclusion: { in: %w[pending screening interview offer rejected] }
  validates :resume, presence: true
end
