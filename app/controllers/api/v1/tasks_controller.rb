class Api::V1::TasksController < ApplicationController
  
  def index
    task = Task.all.order(created_at: :asc)
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

  def search
    @tasks = Task.search(params[:query])
    if request.xhr?
      render :json => @tasks.to_json
    else
      render :index
    end
  end

  private
    def task
      @task ||= Task.find(params[:id])
    end

    def task_params
      params.permit(:title, :tag, :date)
    end

end
