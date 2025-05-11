module Api
  module V1
    class TestController < ApplicationController
      def ping
        render json: { message: "pong" }, status: :ok
      end
    end
  end
end
