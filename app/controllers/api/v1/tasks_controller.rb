class Api::V1::TasksController < ApplicationController
  
  def index
    task = Task.all.order(:tag, created_at: :desc)
    render json: task
  end

  def create
    task = Task.create!(task_params)
    if task
      render json: task
    else
      render json: task.errors
    end
  end

  def show
    if task
      render json: task
    else
      render json: task.errors
    end
  end

  def destroy
    task&.destroy
    render json: { message: 'Task deleted!' }
  end

  def edit
    @task = Task.find(params[:id])
  end

  def update
    if task.update(task_params)
      render json: task
    else
      render json: task.errors
    end
  end

  private
    def task
      @task ||= Task.find(params[:id])
    end

    def task_params
      params.permit(:title, :tag, :id, :task)
    end
end
