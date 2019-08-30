using App;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace AppTests
{
    [TestClass]
    public class MyClassTests
    {
        private MyClass _myClass;

        [TestInitialize()]
        public void Initialize()
        {
            _myClass = new MyClass();
        }

        [TestMethod]
        public void MyClass_ProduceWorld_PassHello_ProduceHelloWorld()
        {
            string result = _myClass.ProduceWorld("Hello");
            Assert.IsTrue(result.Equals("Hello World"));
        }

        [TestMethod]
        public void MyClass_SumValues_SumPositiveValues_ReturnsSum()
        {
            int result = _myClass.SumValues(1, 2);
            Assert.IsTrue(result.Equals(3));
        }

        [TestMethod]
        public void MyClass_MaxInt_AGreater_ReturnsA()
        {
            int result = _myClass.MaxInt(2, 1);
            Assert.IsTrue(result.Equals(2));
        }
    }
}
