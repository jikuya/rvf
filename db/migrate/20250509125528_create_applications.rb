class CreateApplications < ActiveRecord::Migration[8.0]
  def change
    create_table :applications do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :resume_url
      t.string :status, null: false, default: 'pending'
      t.references :job, null: false, foreign_key: true

      t.timestamps
    end

    add_index :applications, :email
    add_index :applications, :status
  end
end
