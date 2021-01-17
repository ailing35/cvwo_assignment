class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.string :title, null: false
      t.date :date, default:Date.today
      t.boolean :completed, default: false

      t.timestamps
    end
  end
end
