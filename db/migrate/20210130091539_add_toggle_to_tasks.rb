class AddToggleToTasks < ActiveRecord::Migration[6.0]
  def change
    add_column :tasks, :editToggle, :boolean, default: false
    add_column :tasks, :tag, :string
    remove_column :tasks, :completed, :boolean, default: false
  end
end
