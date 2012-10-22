require 'rubygems'
require 'em-websocket'

#
# broadcast to all connected users!
#

EventMachine.run {
    @channel = EM::Channel.new

    EventMachine::WebSocket.start(:host => "0.0.0.0", :port => 8080, :debug => true) do |ws|

        ws.onopen {
            sid = @channel.subscribe { |msg| ws.send msg }
            @channel.push "#{sid} connected!"

            ws.onmessage { |msg|
                if msg =~ /^move [up|down|left|right]/ then
                    # send to everyone on this channel
                    @channel.push "#{msg}"
                end
            }

            ws.onclose {
                @channel.unsubscribe(sid)
            }
        }

    end

    puts "Server started"
}
