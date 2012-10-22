require 'rubygems'
require 'em-websocket'

#
# broadcast to all connected users!
#

EventMachine.run {

    # control channel
    @controlChannel = EM::Channel.new
    EventMachine::WebSocket.start(:host => "0.0.0.0", :port => 8080, :debug => true) do |ws|

        ws.onopen {
            sid = @controlChannel.subscribe { |msg| ws.send msg }
            @controlChannel.push "#{sid} connected!"

            ws.onmessage { |msg|
                if msg =~ /^move [up|down|left|right]/ then
                    # send to everyone on this channel
                    @controlChannel.push "#{msg}"
                end
            }

            ws.onclose {
                @controlChannel.unsubscribe(sid)
            }
        }

    end
    
    # chat channel
    @chatChannel = EM::Channel.new
    EventMachine::WebSocket.start(:host => "0.0.0.0", :port => 8081, :debug => true) do |ws|

        ws.onopen {
            sid = @chatChannel.subscribe { |msg| ws.send msg }
            #@chatChannel.push "#{sid} connected!"

            ws.onmessage { |msg|
                # send to everyone on this channel
                @chatChannel.push "#{msg}"
            }

            ws.onclose {
                @chatChannel.unsubscribe(sid)
            }
        }

    end

    puts "Server started"
}
