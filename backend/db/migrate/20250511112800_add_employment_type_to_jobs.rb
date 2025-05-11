class AddEmploymentTypeToJobs < ActiveRecord::Migration[8.0]
  def change
    add_column :jobs, :employment_type, :string
  end
end
