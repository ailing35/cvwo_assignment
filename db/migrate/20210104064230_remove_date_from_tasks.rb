class RemoveDateFromTasks < ActiveRecord::Migration[6.0]
  def change
    remove_column :tasks, :date, :date
  end
end
