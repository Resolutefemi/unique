# frozen_string_literal: true

require_relative "kungfu/version"
require "ffi"

# Kungfu.js — Ruby binding
#
# A polyglot web framework with a Rust core. This Ruby binding uses FFI to
# call into libkungfu_core (the C ABI exposed by the Rust engine).
#
#   require 'kungfu'
#   app = Kungfu::App.new
#   app.get('/hello') do |req|
#     { status: 200, body: 'world' }
#   end
#   app.listen(3000)
module Kungfu
  # Native FFI bindings live in Kungfu::Native; user-facing API is built on top.
  module Native
    extend FFI::Library

    # Users must build libkungfu_core and either install it system-wide or
    # set KUNGFU_LIB_PATH to point at the .so/.dylib/.dll.
    lib_path = ENV["KUNGFU_LIB_PATH"] || "kungfu_core"
    ffi_lib lib_path

    attach_function :kungfu_router_new,    [], :pointer
    attach_function :kungfu_router_free,   [:pointer], :void
    attach_function :kungfu_server_new,    [:pointer], :pointer
    attach_function :kungfu_server_free,   [:pointer], :void
    attach_function :kungfu_server_listen, [:pointer, :string, :uint16], :int32
  end

  class App
    def initialize
      @router = Native.kungfu_router_new
      @server = nil
    end

    def get(path, &block)
      # Route registration goes through the Rust core via the C ABI.
      # V1 ships the scaffold — per-route handler registration requires
      # the Ruby callback bridge planned for V1.1.
      warn "[kungfu] route registration scaffold — see README for status"
    end

    def listen(port)
      @server = Native.kungfu_server_new(@router)
      Native.kungfu_server_listen(@server, "0.0.0.0", port)
    end

    def finalize
      Native.kungfu_server_free(@server) if @server
      Native.kungfu_router_free(@router)
    end
  end
end
