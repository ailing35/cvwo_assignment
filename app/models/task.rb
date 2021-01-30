class Task < ApplicationRecord
    validates :title, presence: true
    validates :tag, presence: true
end
