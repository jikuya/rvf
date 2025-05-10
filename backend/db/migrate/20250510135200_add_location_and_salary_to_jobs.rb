class AddLocationAndSalaryToJobs < ActiveRecord::Migration[8.0]
  def change
    add_column :jobs, :location, :string, null: false
    add_column :jobs, :salary, :string, null: false
  end
end
