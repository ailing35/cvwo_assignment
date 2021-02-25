class Task < ApplicationRecord
    belongs_to :user
    validates :title, presence: true
    validates :tag, presence: true
end
