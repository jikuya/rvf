class AddSizeToCompanies < ActiveRecord::Migration[8.0]
  def change
    add_column :companies, :size, :string
  end
end
