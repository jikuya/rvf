class AddSalaryRangeToJobs < ActiveRecord::Migration[8.0]
  def change
    add_column :jobs, :salary_range, :string
  end
end
