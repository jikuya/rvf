class Job < ApplicationRecord
  belongs_to :company
  has_many :job_applications, dependent: :destroy

  validates :title, presence: true
  validates :description, presence: true
  validates :location, presence: true
  validates :salary, presence: true
end
