class AddFoundedYearToCompanies < ActiveRecord::Migration[8.0]
  def change
    add_column :companies, :founded_year, :integer
  end
end
