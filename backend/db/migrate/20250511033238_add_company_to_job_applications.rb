class AddCompanyToJobApplications < ActiveRecord::Migration[8.0]
  def change
    add_reference :job_applications, :company, null: false, foreign_key: true
  end
end
