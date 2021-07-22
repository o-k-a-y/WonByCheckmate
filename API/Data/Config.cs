using System;

namespace API.Data {
    public class Config {
        public string Rules { get; set; }
        public string TimeClass { get; set; }
        public string TimeControl { get; set; }

        public Config(string rules, string timeClass, string timeControl) => (Rules, TimeClass, TimeControl) = (rules, timeClass, timeControl);

        public bool Equals(Config other) {
            return other != null && 
                Rules.Equals(other.Rules) && 
                TimeClass.Equals(other.TimeClass) && 
                TimeControl.Equals(other.TimeControl);
        }

        public override int GetHashCode() {
            return HashCode.Combine(Rules, TimeClass, TimeControl);
        }

        // TODO: Put timeclass before time control once everything is fixed
        public override string ToString() {
            return $"{Rules}:{TimeControl}:{TimeClass}";
        }
    }
}