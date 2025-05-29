import base64

# Base64 encoded PNG data for simple colored square icons
# These are minimal 1x1 pixel PNGs that will be scaled up

# Purple-blue gradient effect simulated with solid color
icon16_data = "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABPSURBVDiN7Y4xDQAgDATBQgEGJGDBgAQsGJBgoCo6kqb5F903yZUUQgjBvTGz1lpEBKUUxhj23hERtNaYc6K1hhCCMQbWWiilYK0lIr4PHNknGJhLUqLEAAAAAElFTkSuQmCC"
icon48_data = "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABcSURBVGiB7dCxCYAwEAbhH7EQbCy0sLCx0MLCRgsbC7WwsBALLVJ4gkEQPBjnG+4f7jgQQvhLRISZUUpBKQURQQiBiKCUgohgrYWIwFqLiEBEYK2FiEBEICL+D3wB9TId8V/LAAAAAElFTkSuQmCC"
icon128_data = "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAB1SURBVHic7dAxAQAACAOgif/eLS4GJhAYkAQMSAIGJAEDkoABScCAJGBAEjAgCRiQBAxIAgYkAQOSgAFJwIAkYEASMCAJGJAEDEgCBiQBA5KAAUnAgCRgQBIwIAkYkAQMSAIGJAEDkoABScCAJGBAEjAgCRj4AJqDHTE3tOR3AAAAAElFTkSuQmCC"

# Save the icons
with open('icon16.png', 'wb') as f:
    f.write(base64.b64decode(icon16_data))
print("Created icon16.png")

with open('icon48.png', 'wb') as f:
    f.write(base64.b64decode(icon48_data))
print("Created icon48.png")

with open('icon128.png', 'wb') as f:
    f.write(base64.b64decode(icon128_data))
print("Created icon128.png")

print("\n✅ All icons created successfully!")
print("\n📦 Your Chrome extension is ready to install!")
