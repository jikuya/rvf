class Application < ApplicationRecord
  belongs_to :job

  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :status, presence: true, inclusion: { in: %w[pending screening interview offer rejected] }
end
