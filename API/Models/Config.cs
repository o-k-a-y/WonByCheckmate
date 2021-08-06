using System;

namespace API.Data {
    public class Config : IEquatable<Config> {
        public string Rules { get; private set; }
        public string TimeClass { get; private set; }
        public string TimeControl { get; private set; }

        public Config(string rules, string timeClass, string timeControl) => (Rules, TimeClass, TimeControl) = (rules, timeClass, timeControl);

        // Instead of implementing interface, this is possible, but probably better to use the interface to enforce the contract
        //  public override bool Equals(object obj)
        //     => Equals(obj as Config);

        public bool Equals(Config other) {
            return other != null && 
                Rules.Equals(other.Rules) && 
                TimeClass.Equals(other.TimeClass) && 
                TimeControl.Equals(other.TimeControl);
        }

        public override int GetHashCode() {
            return HashCode.Combine(Rules, TimeClass, TimeControl);
        }

        public override string ToString() {
            return $"{Rules}:{TimeClass}:{TimeControl}";
        }
    }
}