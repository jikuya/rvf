class AddPasswordDigestToCompanies < ActiveRecord::Migration[8.0]
  def change
    add_column :companies, :password_digest, :string
  end
end
